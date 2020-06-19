defmodule HillsideJukebox.UserPool do
  defstruct ~w[
    room_code
    user_map
    host_queue
  ]a
  use Agent
  require Logger
  alias HillsideJukebox.{User}

  # Agent stores the UserPool struct.
  #  - user_map is a Map[user_id -> User]
  #  - host_queue is a :queue[user_id]

  def start_link(room_code) do
    Agent.start_link(fn ->
      %HillsideJukebox.UserPool{room_code: room_code, user_map: %{}, host_queue: :queue.new()}
    end)
  end

  def add_user(pid, new_user = %User{id: user_id}) do
    Agent.get_and_update(pid, fn pool = %__MODULE__{user_map: users, host_queue: host_queue} ->
      if Map.has_key?(users, user_id) do
        {{:error, :already_in_pool}, users}
      else
        updated_user_map = Map.put(users, user_id, new_user)
        new_host_queue = :queue.in(user_id, host_queue)
        {{:ok, new_user}, %{pool | user_map: updated_user_map, host_queue: new_host_queue}}
      end
    end)
  end

  def has_user?(pid, %User{id: user_id}) do
    Agent.get(pid, fn %__MODULE__{user_map: users} ->
      Map.has_key?(users, user_id)
    end)
  end

  def get_by_user_id(pid, user_id) do
    Agent.get(pid, fn %__MODULE__{user_map: users} ->
      Map.get(users, user_id)
    end)
  end

  def get_all(pid) do
    Agent.get(pid, fn %__MODULE__{user_map: users} ->
      Map.values(users)
    end)
  end

  def remove_with_user_id(pid, user_id) do
    Agent.get_and_update(pid, fn state = %__MODULE__{user_map: users} ->
      {user, new_map} = Map.pop(users, user_id)
      maybe_new_host = determine_new_host(state)
      broadcast_new_host(maybe_new_host)
      {user, %{state | user_map: new_map}}
    end)
  end

  def get_host(pid) do
    Agent.get(pid, fn %__MODULE__{host_queue: host_queue} ->
      case :queue.peek(host_queue) do
        {:value, host_id} -> {:ok, host_id}
        _ -> {:error, "no host"}
      end
    end)
  end

  defp determine_new_host(state = %__MODULE__{user_map: users, host_queue: host_queue}) do
    if :queue.is_empty(host_queue) do
      {:error, "no host"}
    else
      {:value, user_id} = :queue.peek(host_queue)

      if Map.has_key?(users, user_id) do
        {:ok, user_id}
      else
        {{:value, _}, new_queue} = :queue.out(host_queue)
        determine_new_host(%{state | user_map: users, host_queue: new_queue})
      end
    end
  end

  defp broadcast_new_host({:ok, _new_host_id}) do
    # do the broadcast here
  end

  defp broadcast_new_host({:error, "no host"}) do
    # start room shutdown timer
  end
end
