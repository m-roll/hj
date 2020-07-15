# Hillside jukebox https://github.com/m-roll

## About

Sesh is a way for multiple people to submit spotify tracks to a common queue.
That is, multiple people can submit their favorite track and eventually have it played through
a "Sesh", or a group of users identified by a room code.

Users in a Sesh can also tune in with their Spotify account so many people can listen together at
the same time. Users without Spotify accounts can join a Sesh too, to add songs they want to listen to.

## How to use

Rooms are used so anyone can spin up their own jukebox. You will be prompted to either join or create a room when you first visit the website. If you create a room, the 4 letter room code will be visible in the URL slug. Share this code so other people can join your room and tune in.

To add a song to a Sesh queue, click the "plus" button in the upper left corner.

To vote to skip a song, click the "skip" button in the lower right corner.

Share the four-letter Sesh code with your friends (top left) so they can add songs or listen in as well.

## Why elixir?

Elixir gave me a lot of flexibility for scaling this application. Each jukebox room runs as it's own process within the application. If the application garners much traffic, it will be very easy to implement load balancing between different nodes: we just spin up room processes on different servers within the VM. There is a registry which keeps track of room IDs and what process they point to. This registry is very lightweight and fast, so looking up which node each process runs on is basically trivial.

I hope to eventually implement chat into this service as well, so users in a room can interact with each other and discuss which songs they would like to play. The erlang environment is great for telecommunications-like services (such as chat), and this model also fit very well with the queue model.

Also, Elixir is fun!

## Setup

To start your Phoenix server:

- Install dependencies with `mix deps.get`
- Install Node.js dependencies with `cd assets && npm install`
- Start Phoenix endpoint in top level directory with `mix phx.server`

### Obtain Spotify Developer Info

To run this application locally, you will need to connect your Spotify Developer to your personal Spotify account.

- Visit your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/login) after you log in or sign up
- Click "CREATE A CLIENT ID" and create a new applicatioin
- Once made, you'll be able to view your Client ID and Client Secret key used next for setting up the config files
- To retrieve your Spotify User ID, go to the [Spotify Web Player](https://open.spotify.com/), click on your profile picture in the top right and then "Profile"
- Your Spotify User ID will be the string of digits at the end of that URL

### Setting up config files

In your config folder, create the following files.

config.secret.exs

```
use Mix.Config

config :despotify,
  client_id: "<YOUR SPOTIFY CLIENT ID>",
  secret_key: "<YOUR SPOTIFY CLIENT SECRET>"

config :hj, Hj.Repo,
  username: <postgres username>,
  password: <postgres password>

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

# Deploying to production

- Deploys are now an internal operation. Contact me if you are interested in learning how to do this. I currently am
  using Docker and Docker Compose to deploy to a single node but hope to expand.
