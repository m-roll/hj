defmodule HillsideJukebox.Users do
  use Agent
  require Logger

  def start_link(_) do
    Agent.start_link(fn -> [] end, name: __MODULE__)
  end

  def add_credentials(new_credentials = %Spotify.Credentials{}) do
    Agent.update(__MODULE__, fn users ->
      [%HillsideJukebox.User{spotify_credentials: new_credentials} | users]
    end)
  end

  def set_device_id(access_token, new_device_id) do
    Agent.update(__MODULE__, fn users ->
      Enum.map(
        users,
        fn user = %HillsideJukebox.User{
             spotify_credentials: %Spotify.Credentials{access_token: at}
           } ->
          if(access_token == at) do
            %{user | device_id: new_device_id}
          else
            user
          end
        end
      )
    end)
  end

  def get_all() do
    Agent.get(__MODULE__, &Function.identity/1)
  end

  def remove_with_user_id(user_id) do
    Agent.update(__MODULE__, fn users -> remove_matching(user_id, users) end)
  end

  def is_registered(creds) do
    users = Agent.get(__MODULE__, &Function.identity/1)

    match =
      Enum.find(users, fn %HillsideJukebox.User{
                            spotify_credentials: credentials
                          } ->
        credentials == creds
      end)

    case match do
      nil ->
        false

      _ ->
        true
    end
  end

  defp remove_matching(user_id_out, users) do
    Enum.reject(users, fn %HillsideJukebox.User{user_id: user_id} ->
      user_id == user_id_out
    end)
  end
end
