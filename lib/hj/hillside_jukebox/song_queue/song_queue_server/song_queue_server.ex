defmodule HillsideJukebox.SongQueue.Server do
  require Logger
  use Agent

  def start_link(initial_queue) do
    Agent.start_link(fn -> {nil, initial_queue} end)
  end

  def add(pid, new_entry) do
    Agent.update(pid, fn {next, queue} ->
      {next, :queue.in(new_entry, queue)}
    end)
  end

  def is_empty(pid) do
    :queue.is_empty(
      Agent.get(pid, fn {_next, queue} ->
        queue
      end)
    )
  end

  def next(pid) do
    Agent.get_and_update(pid, fn {_, queue} ->
      {{:value, song}, new_queue} = :queue.out(queue)
      {song, {song, new_queue}}
    end)
  end

  def current(pid) do
    Agent.get(pid, fn {cur, _} -> cur end)
  end
end
