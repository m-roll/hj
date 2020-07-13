# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :hj, Hj.Repo,
  database: "hj_repo",
  hostname: "localhost",
  port: 5432

import_config "config.secret.exs"

# Configures the endpoint
config :hj, HjWeb.Endpoint,
  url: [host: "http://localhost"],
  secret_key_base: "JTSfmjLwGLK2nbIVoxuT7EkCbkrusszYwFrAMQDEgui0OJrAwYZw5qqFV/b6mGZP",
  render_errors: [view: HjWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Hj.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :despotify,
  api_base_url: "https://api.spotify.com/v1",
  scopes: [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state"
  ]

# Configure postgrex. Config for username/pw should be set in `config.secret.exs'
config :hj, Hj.Repo,
  database: "hj_repo",
  hostname: "localhost"

# Configure ecto repository list
config :hj,
  ecto_repos: [Hj.Repo]

config :hj, HjWeb.Guardian,
  issuer: "HillsideJukebox",
  # use strong secret in prod
  secret_key: "some-secret"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
