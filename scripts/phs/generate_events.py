#!/usr/bin/env python3
"""Generate public/phs/events.json for the /phs calendar page.

Sources:
  1. master  -- master-schedule.xlsx (repo root). Union of the "Master Home"
     sheet and any rows on "Outdoor stadiumuse" not present on Master Home.
  2. ad      -- hard-coded facility windows from the outgoing athletic
     director (Aug 10-28, 2026), expanded to one event per weekday.
  3. sportsyou -- snapshot of the team ICS feed at scripts/phs/data/sportsyou.ics.
     The feed has no CORS headers so it cannot be fetched from the browser;
     refresh the snapshot and re-run this script before deploying:
       curl -sL "https://calendar.sportsyou.com/access/us-d013f552-4b88-43ce-b91f-d7fbd5d5e687/b159f961-740a-4ccc-a99c-143beda9c2ae" \
         -o scripts/phs/data/sportsyou.ics

Usage: PHS_PASSWORD=<password> python3 scripts/phs/generate_events.py
(requires: pip install openpyxl cryptography)

Output is public/phs/events.json.enc: AES-256-GCM ciphertext with the key
derived from PHS_PASSWORD via PBKDF2-SHA256. The page decrypts it in the
browser with WebCrypto; plaintext never ships to S3.

Duration rule for master events (sheet has start times only): 2 hours by
default, truncated to the start of the next event at the same facility on the
same day. Facility = Subsite if present else Site, with the "Football/Track"
subsite folded into Curtis Field.
"""

import base64
import hashlib
import html
import json
import os
import re
import secrets
import sys
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

import openpyxl
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

ROOT = Path(__file__).resolve().parents[2]
XLSX = ROOT / "master-schedule.xlsx"
ICS = Path(__file__).resolve().parent / "data" / "sportsyou.ics"
OUT = ROOT / "public" / "phs" / "events.json.enc"

LOCAL_TZ = ZoneInfo("America/New_York")
DEFAULT_DURATION = timedelta(hours=2)
PBKDF2_ITERATIONS = 600_000


def facility_of(site, subsite):
    # Football/Track is the Curtis Field subsite; keeping it separate would let
    # the Curtis Field toggle miss most Curtis Field events.
    if subsite == "Football/Track":
        return "Curtis Field"
    return subsite or site


def load_master():
    wb = openpyxl.load_workbook(XLSX, data_only=True)

    def sheet_rows(name):
        rows = []
        for r in wb[name].iter_rows(min_row=2, values_only=True):
            # sheet titles contain HTML entities (e.g. "&amp;")
            title = html.unescape(str(r[0]).strip()) if r[0] else ""
            if not title:
                continue
            rows.append(
                {
                    "title": title,
                    "team": (str(r[1]).strip() if r[1] else ""),
                    "start": r[2],
                    "type": (str(r[4]).strip() if r[4] else ""),
                    "status": (str(r[5]).strip() if r[5] else ""),
                    "opponent": (str(r[7]).strip() if r[7] else ""),
                    "site": (str(r[8]).strip() if r[8] else ""),
                    "subsite": (str(r[9]).strip() if r[9] else ""),
                }
            )
        return rows

    master = sheet_rows("Master Home")
    seen = {(e["title"], e["start"].isoformat(), e["site"], e["subsite"]) for e in master}
    for e in sheet_rows("Outdoor stadiumuse"):
        if (e["title"], e["start"].isoformat(), e["site"], e["subsite"]) not in seen:
            master.append(e)

    for e in master:
        e["facility"] = facility_of(e["site"], e["subsite"])

    # duration: 2h default, truncated at the next same-facility event that day
    master.sort(key=lambda e: (e["facility"], e["start"]))
    for cur, nxt in zip(master, master[1:]):
        end = cur["start"] + DEFAULT_DURATION
        if (
            nxt["facility"] == cur["facility"]
            and nxt["start"].date() == cur["start"].date()
            and nxt["start"] > cur["start"]
        ):
            end = min(end, nxt["start"])
        cur["end"] = end
    master[-1]["end"] = master[-1]["start"] + DEFAULT_DURATION

    events = []
    for e in master:
        events.append(
            {
                "source": "master",
                "title": e["title"],
                "start": e["start"].isoformat(),
                "end": e["end"].isoformat(),
                "facility": e["facility"],
                "location": " / ".join(x for x in (e["site"], e["subsite"]) if x),
                "cancelled": e["status"].lower() == "cancelled",
                "notes": e["opponent"],
            }
        )
    return events


# (start_date, end_date, title, start_time, end_time, location, notes)
AD_WINDOWS = [
    ("2026-08-10", "2026-08-14", "Soccer (AD)", "08:00", "10:00", "Northmen Stadium (turf)", ""),
    ("2026-08-10", "2026-08-14", "Football (AD)", "16:00", "20:30",
     "Northmen Stadium / Curtis Field", "4:30-6:30 turf (Northmen Stadium), 6:30-8:30 grass (Curtis Field)"),
    ("2026-08-10", "2026-08-14", "Marching Band (AD)", "18:30", "20:30", "Northmen Stadium (turf)", ""),
    ("2026-08-17", "2026-08-21", "Soccer (AD)", "08:00", "10:00", "Northmen Stadium (turf)", ""),
    ("2026-08-17", "2026-08-21", "Football (AD)", "16:00", "20:30",
     "Northmen Stadium / Curtis Field", "4:30-6:30 turf (Northmen Stadium), 6:30-8:30 grass (Curtis Field)"),
    ("2026-08-17", "2026-08-21", "Marching Band (AD)", "18:30", "20:30", "Northmen Stadium (turf)", ""),
    ("2026-08-24", "2026-08-28", "Soccer (AD)", "08:00", "10:00", "Northmen Stadium (turf)", ""),
    ("2026-08-24", "2026-08-28", "Football (AD)", "15:30", "18:00", "Northmen Stadium (turf)", ""),
    # band listed with a start time only; 2h default duration applied
    ("2026-08-24", "2026-08-28", "Marching Band (AD)", "18:00", "20:00", "Northmen Stadium (turf)", ""),
]


def load_ad():
    events = []
    for start_date, end_date, title, t0, t1, location, notes in AD_WINDOWS:
        day = datetime.fromisoformat(start_date)
        last = datetime.fromisoformat(end_date)
        while day <= last:
            if day.weekday() < 5:
                events.append(
                    {
                        "source": "ad",
                        "title": title,
                        "start": f"{day.date()}T{t0}:00",
                        "end": f"{day.date()}T{t1}:00",
                        "facility": "",
                        "location": location,
                        "cancelled": False,
                        "notes": notes,
                    }
                )
            day += timedelta(days=1)
    return events


def load_sportsyou():
    raw = ICS.read_text().replace("\r\n", "\n")
    raw = re.sub(r"\n[ \t]", "", raw)  # unfold continuation lines

    def parse_dt(v):
        dt = datetime.strptime(v, "%Y%m%dT%H%M%SZ").replace(tzinfo=ZoneInfo("UTC"))
        return dt.astimezone(LOCAL_TZ).replace(tzinfo=None)

    events = []
    for block in raw.split("BEGIN:VEVENT")[1:]:
        props = {}
        for line in block.strip().split("\n"):
            if ":" in line:
                k, v = line.split(":", 1)
                props[k.split(";")[0]] = v
        if "DTSTART" not in props:
            continue
        summary = props.get("SUMMARY", "").strip()
        start = parse_dt(props["DTSTART"])
        end = parse_dt(props["DTEND"]) if "DTEND" in props else start + DEFAULT_DURATION
        events.append(
            {
                "source": "sportsyou",
                "title": summary,
                "start": start.isoformat(),
                "end": end.isoformat(),
                "facility": "",
                "location": props.get("LOCATION", "").replace("\\,", ",").replace("\\n", " "),
                "cancelled": bool(re.match(r"cancell?ed", summary, re.I)),
                "notes": props.get("DESCRIPTION", "").replace("\\n", " ").replace("\\,", ","),
            }
        )
    return events


def encrypt(plaintext, password):
    salt = secrets.token_bytes(16)
    iv = secrets.token_bytes(12)
    key = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, PBKDF2_ITERATIONS, dklen=32)
    ct = AESGCM(key).encrypt(iv, plaintext.encode(), None)  # ciphertext||tag, WebCrypto-compatible
    b64 = lambda b: base64.b64encode(b).decode()  # noqa: E731
    return json.dumps(
        {"v": 1, "kdf": "PBKDF2-SHA256", "iter": PBKDF2_ITERATIONS, "salt": b64(salt), "iv": b64(iv), "ct": b64(ct)}
    )


def main():
    password = os.environ.get("PHS_PASSWORD")
    if not password:
        sys.exit("PHS_PASSWORD env var is required")
    events = load_master() + load_ad() + load_sportsyou()

    # drop events before the current week (Sunday start, at generation time)
    today = datetime.now(LOCAL_TZ).date()
    week_start = today - timedelta(days=(today.weekday() + 1) % 7)
    events = [e for e in events if e["start"][:10] >= week_start.isoformat()]

    # midnight-start events render as an all-day bar instead of a grid block
    for e in events:
        e["allDay"] = e["start"][11:16] == "00:00"

    events.sort(key=lambda e: e["start"])
    for i, e in enumerate(events):
        e["id"] = i
    facilities = sorted({e["facility"] for e in events if e["facility"]})
    OUT.write_text(encrypt(json.dumps({"facilities": facilities, "events": events}), password))
    by_source = {}
    for e in events:
        by_source[e["source"]] = by_source.get(e["source"], 0) + 1
    print(f"wrote {OUT} events={len(events)} by_source={by_source} facilities={facilities}")


if __name__ == "__main__":
    main()
