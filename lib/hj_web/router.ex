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

    get "/", PageController, :index
    get "/listen", PageController, :listen
    get "/auth", PageController, :auth
    get "/jukebox", PageController, :jukebox
  end

  # Other scopes may use custom stacks.
  # scope "/api", HjWeb do
  #   pipe_through :api
  # end
end
