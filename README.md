# Hillside jukebox https://github.com/m-roll

## About

The Hillside Jukebox is a way for multiple people to submit spotify links to a common queue. 
That is, multiple people can submit their favorite track and eventually have it played through
every browser currently on the [`localhost:4000/`](http://localhost:4000/) page.

Consequently, any browser on the `jukebox` page will sync that users audio playback with any other
user also on the `jukebox` page.

## How to use

Anyone can add songs to the queue without interacting with their spotify account, as long as
they have access to the spotify track URIs they would like to submit. This is great for a scenario
where you have a single device connected to a speaker in a shared living space. Multiple people
can submit songs and eventually get them played. My roommates and I have a RaspPi connected to
our stereo that runs this page, it requires little to no interaction once the page is loaded.

Visit
[`localhost:4000/`](http://localhost:4000/) to add songs using a spotify track URI that
can be copied from any official Spotify client.

If you want to listen in to the jukebox, you will be prompted to tune in. If this is your first time
visiting, Spotify will prompt to give the app permission to play music on your behalf. After you give
permission, you will be redirected back to the jukebox page. If there are any songs in the queue, they will begin playing
when you load the page. Otherwise, have some of your friends add songs they want to hear! If anyone else connects
to your jukebox, their spotify player will connect with the other and play the same songs in sync
with each other.

Rooms are used so anyone can spin up their own jukebox. You will be prompted to either join or create a room when you first visit the website. If you create a room, the 4 letter room code will be visible in the URL slug. Share this code so other people can join your room and tune in.


## Why elixir?

I hope to eventually implement chat into this service as well, so users in a room can interact with each other and discuss which songs they would like to play. The erlang environment is great for telecommunications-like services (such as chat), and this model also fit very well with the queue model.

Elixir also gave me a lot of flexibility for scaling this application. Each jukebox room runs as it's own process within the application. If the application garners much traffic, it will be very easy to implement load balancing between different nodes: we just spin up room processes on different servers within the VM. There is a registry which keeps track of room IDs and what process they point to. This registry is very lightweight and fast, so looking up which node each process runs on is basically trivial.

Also, Elixir is fun!

## Setup
To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`
  
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

* Bug - if someone joins when song is about to end, progress bar is a second long and plays song from start. Maybe an offset glitch with backend.
* bug - socket channel joining is not room specific -- this could leak information to people not in the room, even if we don't match for it.
* names for people
* use async/await on frontend! can't believe i forgot about this
* chat window
* What to do when content isn't available in playback country
* Search feature - use client authorization from spotify so anyone -- not just spotify account holders -- can search the system.
* UI for skipping and # of people listening
* Settings when creating a room <- maybe in a paid version?

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
 * change config setting to embed erlang in the release
