defmodule HillsideJukebox.Users do
  use Agent
  require Logger

  # Agent stores a list of tuple {user, user_state}

  def start_link(_) do
    Agent.start_link(fn -> [] end)
  end

  def add_user(pid, id, new_credentials = %Spotify.Credentials{}, device_id) do
    Agent.get_and_update(pid, fn users ->
      new_user =
        {%HillsideJukebox.User{user_id: id, device_id: device_id},
         %HillsideJukebox.User.State{spotify_credentials: new_credentials}}

      updated_list = [new_user | users]
      {new_user, updated_list}
    end)
  end

  def get_by_user_id(pid, user_id) do
    {user, _state} =
      Agent.get(pid, fn users ->
        Enum.find(
          users,
          map_user_with_user_id(user_id, fn _ -> true end, fn _ -> false end)
        )
      end)

    user
  end

  def get_all(pid) do
    Agent.get(pid, &Function.identity/1)
  end

  def remove_with_user_id(pid, user_id) do
    Agent.update(pid, fn users ->
      Enum.reject(
        users,
        map_user_with_user_id(
          user_id,
          fn {user, _state} ->
            Logger.debug("Rejecting user #{inspect(user)} because they disconnected")
            true
          end,
          fn _ -> false end
        )
      )
    end)
  end

  def is_registered(creds) do
    users = Agent.get(__MODULE__, &Function.identity/1)

    match =
      Enum.find(users, fn {_user,
                           %HillsideJukebox.User.State{
                             spotify_credentials: credentials
                           }} ->
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
    {user, _} = Agent.get(pid, fn users -> List.last(users) end)
    user
  end

  def update_with_id(users_pid, user_id, new_user) do
    Agent.update(users_pid, fn users ->
      Enum.map(
        users,
        map_user_with_user_id(
          user_id,
          fn {_user, state} -> {new_user, state} end,
          &Function.identity/1
        )
      )
    end)
  end

  def get_state(users_pid, user_id) do
    {_user, state} =
      Agent.get(users_pid, fn users ->
        Logger.debug("Getting user state: user_id #{user_id} all users: #{inspect(users)}")

        Enum.find(users, fn {user, _state} ->
          case user do
            %HillsideJukebox.User{user_id: ^user_id} -> true
            _ -> false
          end
        end)
      end)

    state
  end

  def set_state(users_pid, user_id, new_state) do
    Agent.update(users_pid, fn users ->
      Enum.map(
        users,
        map_user_with_user_id(
          user_id,
          fn {user, _state} ->
            {user, new_state}
          end,
          &Function.identity/1
        )
      )
    end)
  end

  def reset_skip_votes(users_pid) do
    Agent.update(users_pid, fn users ->
      Enum.map(users, fn {user, state} -> {user, %{state | voted_skip: false}} end)
    end)
  end

  defp map_user_with_user_id(user_id, match_fun, else_fun) do
    fn pair =
         {%HillsideJukebox.User{
            user_id: id
          }, _} ->
      if(user_id == id) do
        match_fun.(pair)
      else
        else_fun.(pair)
      end
    end
  end
end
