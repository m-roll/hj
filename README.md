# Hillside jukebox

## About

The Hillside Jukebox is a way for multiple people to submit spotify links to a common queue. 
That is, multiple people can submit their favorite track and eventually have it played through
every browser currently on the [`localhost:4000/jukebox`](http://localhost:4000/jukebox) page.

Consequently, any browser on the `jukebox` page will sync that users audio playback with any other
user also on the `jukebox` page.

## How to use

Anyone can add songs to the queue without interacting with their spotify account, as long as
they have access to the spotify track URIs they would like to submit. This is great for a scenario
where you have a single device connected to a speaker in a shared living space. Multiple people
can submit songs and eventually get them played. My roommates and I have a RaspPi connected to
our stereo that runs this page, it requires little to no interaction once the page is loaded.

Visit
[`localhost:4000/add`](http://localhost:4000/add) to add songs using a spotify track URI that
can be copied from any official Spotify client.

If you want to listen in to the jukebox, navigate to the `/listen` page. If this is your first time
visiting, Spotify will prompt to give the app permission to play music on your behalf. After you give
permission, you will be redirected to `/jukebox`. If there are any songs in the queue, they will begin playing
when you load the page. Otherwise, have some of your friends add songs they want to hear! If anyone else connects
to your server's `/jukebox`, their spotify player will connect with the other and play the same songs in sync
with each other.


## Setup
To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`
  * 
  
### Setting up config files

In your config folder, create the following files.

config.secret.exs
```
use Mix.Config

config :spotify_ex,
  client_id: "<your spotify client id>",
  secret_key: "<your spotify secret key>"

```

spotify.secret.exs
```
use Mix.Config

config :spotify_ex,
  user_id: "<YOUR SPOTIFY USER ID>",
  scopes: [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state"
  ],
  callback_url: "http://localhost:4000/auth"
  ```

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Running on multiple nodes

There is support for running this program on a multi-node cluster, although the setup is tedious.
I am working on a better implementation to easily run in across multiple nodes.

## TODO

* PRIORITIES
  * Fix overflow when the queue is long (probably flexbox issue)
  * Allow cards to be collapsed
  * Flow when entering for first time. Create/join room.
* Testing for OTP stuff
* names for people
* use async/await on frontend! can't believe i forgot about this
* chat window



* Make sure we note when a user disconnects. We don't want to keep controlling their audio after they leave the page (DONE)
* New flow
  * If you create a room, you are the leader and must connect your spotify account. API requests for song metadata will use this account (DONE)
  * If you join a room to listen in, you must connect your spotify account only to play audio in sync (DONE)
  * If you are just using the queue, the only thing you need is the room code.

* (Later) Room IDs - one instance of the server handling many seperate queues (DONE - needs UI)
* Gaps in Spotify client. Beta functionality for song playback is missing :( (DONE)

# DEPLOYING TO PRODUCTION

 * Production secrets need to be set a runtime. Use releases instead of prod.config.exs. See "using releases" to set configuration at runtime.
   * Rename `config/prod.secret.exs` to `config/releases.exs`
   * Change use `Mix.Config` inside the new `config/releases.exs` file to `import Config`
   * Change `config/prod.exs` to no longer call `import_config "prod.secret.exs"` at the bottom
 * Releasing
   * `MIX_ENV=prod mix release`
 * Releasing in Docker container
   * TODO add dockerfile to source control
   * This will handle installing all dependencies and allow you to run at `bin/my_app start`
   * Everyone working on this _needs to run docker locally_. Erlang has some issues with compatibility since it is ancient, so everyone needs to be testing/deploying releases on the same OS.