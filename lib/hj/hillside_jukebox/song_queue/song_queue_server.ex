defmodule HillsideJukebox.SongQueue.Server do
  require Logger
  use Agent

  def start_link(stash_pid) do
    initial_queue = HillsideJukebox.SongQueue.Stash.get_value(stash_pid)
    Agent.start_link(fn -> {nil, initial_queue} end, name: __MODULE__)
  end

  def add(new_entry) do
    Agent.update(__MODULE__, fn {next, queue} ->
      {next, :queue.in(new_entry, queue)}
    end)
  end

  def is_empty() do
    :queue.is_empty(
      Agent.get(__MODULE__, fn {_next, queue} ->
        # Logger.debug("EMPTY CHECK WITH QUEUE: #{inspect(queue)}")
        queue
      end)
    )
  end

  def next() do
    get =
      Agent.get_and_update(__MODULE__, fn {_, queue} ->
        {{:value, song}, new_queue} = :queue.out(queue)
        # Logger.debug("POPPING FROM QUEUE: #{inspect(queue)}")
        # Logger.debug("POPPING FROM QUEUE: #{inspect(new_queue)}")
        {song, {song, new_queue}}
      end)
  end

  def current() do
    Agent.get(__MODULE__, fn {cur, _} -> cur end)
  end
end
