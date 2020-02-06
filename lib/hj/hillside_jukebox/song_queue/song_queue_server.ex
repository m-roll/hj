defmodule HillsideJukebox.SongQueue.Server do
  use Agent

  def start_link(stash_pid) do
    initial_queue = HillsideJukebox.SongQueue.Stash.get_value(stash_pid)
    Agent.start_link(fn -> {nil, initial_queue} end, name: __MODULE__)
  end

  def add(new_entry) do
    Agent.update(__MODULE__, fn {next, queue} -> {next, :queue.in(new_entry, queue)} end)
  end

  def is_empty() do
    :queue.is_empty(Agent.get(__MODULE__, fn state -> state end))
  end

  def next() do
    Agent.get_and_update(__MODULE__, fn {_, queue} -> :queue.out(queue) end)
  end

  def current() do
    Agent.get(__MODULE__, fn {cur, _} -> cur end)
  end
end
