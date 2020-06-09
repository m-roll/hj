defmodule HillsideJukebox.UserPool do
  use Agent
  require Logger
  alias HillsideJukebox.{User}

  # Agent stores a map of user_id -> {user, user_state}

  def start_link(_) do
    Agent.start_link(fn -> %{} end)
  end

  def add_user(pid, user = %User{id: user_id}) do
    Agent.get_and_update(pid, fn users ->
      if Map.has_key?(users, user_id) do
        {{:error, :already_in_pool}, users}
      else
        new_user = {user, %HillsideJukebox.User.State{}}

        updated_user_map = Map.put(users, user_id, new_user)
        {{:ok, new_user}, updated_user_map}
      end
    end)
  end

  def get_by_user_id(pid, user_id) do
    {user, _state} =
      Agent.get(pid, fn users ->
        Map.get(users, user_id)
      end)

    user
  end

  def get_all(pid) do
    Agent.get(pid, &Map.values/1)
  end

  def remove_with_user_id(pid, user_id) do
    Agent.get_and_update(pid, fn users ->
      Map.pop(users, user_id)
    end)
  end

  def get_state(users_pid, user_id) do
    case Agent.get(users_pid, fn users ->
           Map.fetch(users, user_id)
         end) do
      {:ok, {_user, state}} -> {:ok, state}
      error -> error
    end
  end

  def set_state(users_pid, user_id, new_state) do
    Agent.update(users_pid, fn users ->
      case Map.fetch(users, user_id) do
        {:ok, {user, old_state}} -> Map.replace!(users, user_id, new_state)
        error -> users
      end
    end)
  end

  def reset_skip_votes(users_pid) do
    Agent.update(users_pid, fn users ->
      Enum.into(
        Enum.map(users, fn {user_id, {user, state}} ->
          {user_id, {user, %{state | voted_skip: false}}}
        end),
        %{}
      )
    end)
  end
end
