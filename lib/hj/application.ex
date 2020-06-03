defmodule Hj.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    # List all child processes to be supervised
    children = [
      # Start the endpoint when the application starts
      HjWeb.Endpoint,
      HillsideJukebox.Room.Supervisor,
      HillsideJukebox.Room.CodesRegistry,
      # keeps track of user state for spotify oauth redirect
      HillsideJukebox.Auth.UserSession,
      # Add repo to supervision tree
      {Hj.Repo, []}
      # Starts a worker by calling: Hj.Worker.start_link(arg)
      # {Hj.Worker, arg},
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Hj.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    HjWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
