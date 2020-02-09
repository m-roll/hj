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

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## TODO

* Gaps in Spotify client. Beta functionality for song playback is missing :(
* Testing for OTP stuff
* Refresh auth token if we get a 401 from Spotify. (Trivial with the Spotify client)
* Make sure we note when a user disconnects. We don't want to keep controlling their audio after they leave the page
* (Later) Better authorization flow -- would be better all as one page. Maybe grey out the UI and prompt for activation.
* (Later) Room IDs - one instance of the server handling many seperate queues