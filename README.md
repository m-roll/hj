# Hillside jukebox

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

* PRIORITIES
  * Fix overflow when the queue is long (probably flexbox issue)
  * Allow cards to be collapsed
  * Flow when entering for first time. Create/join room.
* Testing for OTP stuff
* names for people
* chat window
