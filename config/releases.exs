import Config

# RUNTIME configuration for release
# Environment variable summary:
# - SECRET_KEY_BASE: Key base for Phoenix (use mix phx.gen.secret)
# - APP_HOST: The hostname of the application in production, used for generating URLs
# - APP_PORT: The port number of the application in production.
# - APP_REDIRECT_URL: The redirect url for Spotify authorization calls
# - GUARDIAN SECRET: Secret guardian token for authenticating websocket calls (mix guardian.gen.secret)
# - POSTGRES_USERNAME: Username for logging into postgres server
# - POSTGRES_PASSWORD: password for logging into postgres
# - POSTGRES_HOSTNAME: Host name for logging into postgres (probably localhost)

secret_key_base =
  System.get_env("SECRET_KEY_BASE") ||
    raise """
    environment variable SECRET_KEY_BASE is missing.
    You can generate one by calling: mix phx.gen.secret
    """

db_username = System.get_env("POSTGRES_USERNAME") || "postgres"
db_password = System.get_env("POSTGRES_PASSWORD") || "postgres"
db_hostname = System.get_env("POSTGRES_HOSTNAME") || "db"
db_database = System.get_env("POSTGRES_DB") || "hj_repo"

db_url = "ecto://#{db_username}:#{db_password}@#{db_hostname}/#{db_database}"

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

config :hj, HjWeb.Guardian,
  issuer: "HillsideJukebox",
  secret_key: System.get_env("GUARDIAN_SECRET")

config :hj, Hj.Repo,
  database: db_database,
  username: db_username,
  password: db_password,
  hostname: db_hostname
