import Config

secret_key_base =
  System.get_env("SECRET_KEY_BASE") ||
    raise """
    environment variable SECRET_KEY_BASE is missing.
    You can generate one by calling: mix phx.gen.secret
    """

config :hj, HjWeb.Endpoint,
  url: [host: System.get_env("APP_HOST")],
  http: [:inet6, port: String.to_integer(System.get_env("APP_PORT") || "4000")],
  secret_key_base: secret_key_base

config :hj, HjWeb.Endpoint, server: true

config :spotify_ex,
  user_id: "<YOUR SPOTIFY USER ID>",
  scopes: [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state"
  ],
  callback_url: System.get_env("APP_REDIRECT_URI")
