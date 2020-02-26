defmodule HillsideJukebox.Users do
  use Agent
  require Logger

  def start_link(_) do
    Agent.start_link(fn -> [] end)
  end

  def add_credentials(pid, new_credentials = %Spotify.Credentials{}) do
    Agent.get_and_update(pid, fn users ->
      new_user = %HillsideJukebox.User{spotify_credentials: new_credentials}
      updated_list = [new_user | users]
      {new_user, updated_list}
    end)
  end

  def get_by_user_id(pid, user_id) do
    Agent.get(pid, fn users ->
      Enum.find(
        users,
        map_user_with_user_id(user_id, fn _ -> true end, fn _ -> false end)
      )
    end)
  end

  def set_device_id(pid, user_id, new_device_id) do
    Agent.update(pid, fn users ->
      Enum.map(
        users,
        map_user_with_user_id(
          user_id,
          fn user -> %{user | device_id: new_device_id} end,
          &Function.identity/1
        )
      )
    end)
  end

  def set_user_id_from_token(pid, access_token, new_user_id) do
    Agent.update(pid, fn users ->
      Enum.map(
        users,
        fn user ->
          case user do
            %HillsideJukebox.User{
              spotify_credentials: %Spotify.Credentials{access_token: ^access_token}
            } ->
              %{user | user_id: new_user_id}

            _ ->
              user
          end
        end
      )
    end)
  end

  def get_all(pid) do
    Agent.get(pid, &Function.identity/1)
  end

  def remove_with_user_id(pid, user_id) do
    Agent.update(pid, fn users ->
      Enum.reject(
        users,
        map_user_with_user_id(user_id, fn _ -> true end, fn _ -> false end)
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

  defp map_user_with_user_id(user_id, match_fun, else_fun) do
    fn user = %HillsideJukebox.User{
         user_id: id
       } ->
      if(user_id == id) do
        match_fun.(user)
      else
        else_fun.(user)
      end
    end
  end
end
