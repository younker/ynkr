import React from 'react';

export default function HelpPage() {
  <pre>{`
TIC-TAC-TOE(1)                  BS Command Manual                 TIC-TAC-TOE(1)

NAME
    tic-tac-toe -- play a game of tic-tac-toe

SYNOPSIS
    tic-tac-toe [-vh]

DESCRIPTION
    Will start a game of tic-tac-toe where the current user is player one and
    player two is either a bot or another human.

    The options are as follows:

    --vs v
        Player one's opponent. By default, it is defined as BOT. Currently BOT
        will make an HTTP request to an API hosting the lamda function found at
        https://github.com/younker/tic-tac-toe

        If you would rather play against yourself, the 'human' value for this
        option is availabe.

EXAMPLES

    The following examples are shown as given to the shell:

    $ tic-tac-toe

        Will start a normal game of tic-tac-toe where player one is current user
        and player two is a bot.

    $ tic-tac-toe --vs human

        Same thing, no bot.

HISTORY

An early variation of tic-tac-toe was played in the Roman Empire, around the
first century BC. It was called terni lapilli (three pebbles at a time) and
instead of having any number of pieces, each player only had three, thus they
had to move them around to empty spaces to keep playing.

BS                               March 16, 2019                               BS
`}</pre>
};
