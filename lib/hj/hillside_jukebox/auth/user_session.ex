defmodule HillsideJukebox.Auth.UserSession do
  use Agent
  defstruct ~w[
    room_code
  ]a

  @initial_map %{}

  def start_link(_) do
    Agent.start_link(fn -> @initial_map end, name: __MODULE__)
  end

  def save_state(nonce, state) do
    Agent.update(__MODULE__, fn map -> Map.put(map, nonce, state) end)
    # evict after 5 minutes, if not already
    Task.start(fn ->
      Process.sleep(5 * 60 * 1000)
      pop_state(nonce)
    end)
  end

  def pop_state(nonce) do
    Agent.get_and_update(__MODULE__, fn map ->
      state = Map.fetch(map, nonce)
      new_map = Map.delete(map, nonce)
      {state, new_map}
    end)
  end
end
