use Mix.Config

config :spotify_ex,
  user_id: "<YOUR SPOTIFY USER ID>",
  scopes: ["streaming", "user-read-playback-state", "user-modify-playback-state"],
  callback_url: "http://localhost:4000/auth"
