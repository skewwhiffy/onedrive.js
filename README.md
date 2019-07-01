# onedrive.js

Tool written in node.js to synchronize a local copy of your onedrive files.

## How to start

* `npm run build`
* `npm start`
* Go to `localhost:38080` in your browser.
* Add user.
* Log into onedrive.
* Watch your files appear, as if by magic, at ~/onedrive.js

## Motivation

Unhappy with current clients out there: I have a pretty large (~ 500 MB) onedrive directory, and none of the current tools would deal with that without falling over constantly, or racking up 100% usage on one of my CPU cores.

Second was a large amount of music that I kept in my onedrive, with no way of accessing it randomly without synchronizing the whole lot. I really liked the old MS Groove app that allowed this, but this was Windows only (also Android, but now not), and I wanted to do this for Linux / OSX. Clementine promised to do this, but I was struggling to make this work, only succeeding for one or two songs before the thing crashed on me.

## Zero to hero

Pretty simple really.
* `npm run build`
* Frontend is in vue, as a separate project.
  * In one terminal, navigate to the `frontend` project, and `npm run serve`
  * In another terminal, at the root of this repo, `export NODE_ENV=dev` and `npm start` (to bypass CORS for development purposes)

## TODO

* Synchronize local changes to onedrive.
* Allow other ports other than 38080.
* Allow multiple users.
* Install as service.
* Package up nicely.
* Protect users with credentials/tokens so that we can open up the service to the world.
* Expose media player.
