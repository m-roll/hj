defmodule HillsideJukebox.Users do
  use Agent
  require Logger

  def start_link(_) do
    Agent.start_link(fn -> [] end)
  end

  def add_credentials(pid, new_credentials = %Spotify.Credentials{}) do
    Agent.update(pid, fn users ->
      [%HillsideJukebox.User{spotify_credentials: new_credentials} | users]
    end)
  end

  def get_by_access_token(pid, access_token) do
    Agent.get(pid, fn users ->
      Enum.find(
        users,
        map_user_with_access_token(access_token, fn _ -> true end, fn _ -> false end)
      )
    end)
  end

  def set_device_id(pid, access_token, new_device_id) do
    Agent.update(pid, fn users ->
      Enum.map(
        users,
        map_user_with_access_token(
          access_token,
          fn user -> %{user | device_id: new_device_id} end,
          &Function.identity/1
        )
      )
    end)
  end

  def get_all(pid) do
    Agent.get(pid, &Function.identity/1)
  end

  def remove_with_access_token(pid, access_token) do
    Agent.update(pid, fn users ->
      Enum.reject(
        users,
        map_user_with_access_token(access_token, fn _ -> true end, fn _ -> false end)
      )
    end)
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

  def get_host(pid) do
    Agent.get(pid, fn users -> List.last(users) end)
  end

  defp map_user_with_access_token(access_token, match_fun, else_fun) do
    fn user = %HillsideJukebox.User{
         spotify_credentials: %Spotify.Credentials{access_token: at}
       } ->
      if(access_token == at) do
        match_fun.(user)
      else
        else_fun.(user)
      end
    end
  end
end
