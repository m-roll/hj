defmodule HjWeb.Router do
  use HjWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :auth do
    plug HjWeb.Auth.Pipeline
  end

  pipeline :ensure_auth do
    plug Guardian.Plug.EnsureAuthenticated
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", HjWeb do
    pipe_through [:browser, :auth]

    get "/authorize", PageController, :authorize
    get "/auth", PageController, :auth
    get "/", PageController, :jukebox
    get "/room/:room_code", PageController, :jukebox
    get "/disconnect-success", PageController, :disconnect_success
    get "/not-premium", PageController, :not_premium
  end

  scope "/", HjWeb do
    pipe_through [:browser, :auth, :ensure_auth]

    get "/createroom", PageController, :create_room
    get "/room/:room_code/listen", PageController, :listen
    get "/disconnect", PageController, :disconnect
  end
end
