# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

import_config "config.secret.exs"
import_config "spotify.secret.exs"

# Configures the endpoint
config :hj, HjWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "JTSfmjLwGLK2nbIVoxuT7EkCbkrusszYwFrAMQDEgui0OJrAwYZw5qqFV/b6mGZP",
  render_errors: [view: HjWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Hj.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
