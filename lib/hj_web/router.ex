defmodule HjWeb.Router do
  use HjWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", HjWeb do
    pipe_through :browser

    get "/authorize", PageController, :authorize
    get "/auth", PageController, :auth
    get "/", PageController, :jukebox
    get "/createroom", PageController, :create_room
    get "/:room_code", PageController, :jukebox
  end

  # Other scopes may use custom stacks.
  # scope "/api", HjWeb do
  #   pipe_through :api
  # end
end
