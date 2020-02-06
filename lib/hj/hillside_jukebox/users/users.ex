defmodule HillsideJukebox.Users do
  use Agent

  def start_link() do
    Agent.start_link(fn -> [] end, name: __MODULE__)
  end

  def add(user = %HillsideJukebox.User{}) do
    Agent.update(__MODULE__, fn users -> [user | users] end)
  end

  def get_all() do
    Agent.get(__MODULE__, fn users -> users end)
  end

  def remove(authorization) do
    Agent.update(__MODULE__, fn users -> remove_with_authorization(authorization, users) end)
  end

  def update_authentication(authorization, new_credentials = %Spotify.Credentials{}) do
    Agent.update(__MODULE__, fn users ->
      replace_authentication_for(authorization, new_credentials, users)
    end)
  end

  defp remove_with_authorization(authorization, users) do
    Enum.reject(users, fn %HillsideJukebox.User{authorization_token: token} ->
      authorization == token
    end)
  end

  defp replace_authentication_for(
         authorization,
         creds = %Spotify.Credentials{},
         users
       ) do
    Enum.map(users, fn user ->
      case user do
        %HillsideJukebox.User{authorization_token: ^authorization} ->
          %{user | spotify_credentials: creds}

        _ ->
          user
      end
    end)
  end
end
