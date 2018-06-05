# YNKR

The Cobbler's children have no shoes...and I don't have a real website.

## Deploy / Workflow

1. `git commit`: make edits, commit, rinse, repeat
2. `npm run build`: when done, build the current release using to the `/build` folder
3. `git push ynkr master`: pushes master to the remote (webfaction) server

That should be it. If things fail, you will likely want to start by ensuring the `post-receive` git hook on the remote server ran, updated the app's code and the node process was restarted.


## Deploy Setup

I wrote this several days after the fact so I'll apologize to my future self for getting some of this wrong.

The app is deployed via `git`. The basic setup process was as follows:

- In the [webfaction](https://my.webfaction.com/applications) applications dashboard, I created 2 applications:

  - `git`: This will handle the repo and the `post-receive` hook used to update the site.
    **This application is set up to handle other repos/apps and so this step should not be needed for subsequent deployables for this account.**

  - `nodejs`: This application was setup following the [instructions found in a webfaction helpdoc](https://docs.webfaction.com/software/git.html).

- The final location of the `.git` dir for the ynkr repo on the webfaction server is at `/home/younker/webapps/git/repos/ynkr.git`. It is here, in `hooks/post-receive`, where the files for the ynkr website are "copied" to the `ynkr_react` application. This is the contents of the post-receive hook:

  ```
  #!/bin/sh
  GIT_WORK_TREE=/home/younker/webapps/ynkr_reactjs/app git checkout -f master
  GIT_WORK_TREE=/home/younker/webapps/ynkr_reactjs/app git reset --hard
  ```

  * `-f`: "force" will effectively throw away local changes (what is currently in `GIT_WORK_TREE`) with what is in master (aka the new release)

  Do not forget to run `chmod +x hooks/post-receve`!

- on my local (mac) machine, I then set up the remote's config and called it `ynkr`.

  ```
  subl .git/config


  [remote "ynkr"]
    url = ssh://younker.webfactional.com/home/younker/webapps/git/repos/ynkr.git
    fetch = +refs/heads/*:refs/remotes/ynkr/*
  ```

- With this in place, whenever we `git push` to this remote, we will checkout master to `/home/younker/webapps/ynkr_reactjs/app`.

  * `remote`: in the distributed git world, a remote is simply another machine or location and is knowable via config found in the `.git/config` file.

  When webfaction setup the node app (`ynkr_react`) adding some files to `/home/younker/webapps/ynkr_reactjs` which are used to keep the app running.

  - `bin/start`: This file basically checks to see if a node app is running. If not, it will start the current app build using `nohup` (a standin for the popular forever node CLI) to ensure it stays up. The `port` has to be passed in via the `-l` (listen) flag; you can find the port for the app in the webfaction dashboard for that application. After that, it dumps the pid to a known location and exits.

  I had to modify the start script both to point at the proper locations but also to start the app a specific way. It ended up looking like this:

  ```
  #!/bin/sh
  /sbin/pidof /home/younker/webapps/ynkr_reactjs/bin/node > /dev/null 2>&1 && exit 0
  mkdir -p /home/younker/webapps/ynkr_reactjs/run
  (cd /home/younker/webapps/ynkr_reactjs/app; nohup serve -s build -l 25928&)
  /sbin/pidof /home/younker/webapps/ynkr_reactjs/bin/node > /home/younker/webapps/ynkr_reactjs/run/node.pid
  ```

  - `bin/stop`: I forget if I had to edit this file or not.

**Helpful Setup Docs**
- https://www.jamestease.co.uk/blether/deploying-express-nodejs-app-to-webfaction-using-git-hooks
- https://docs.webfaction.com/software/git.html
- http://toroid.org/git-website-howto
- https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks
