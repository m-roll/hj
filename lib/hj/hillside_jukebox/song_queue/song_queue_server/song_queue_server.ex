defmodule HillsideJukebox.SongQueue.Server do
  require Logger
  use Agent

  def start_link(initial_queue) do
    Agent.start_link(fn -> initial_queue end)
  end

  def add(pid, new_entry) do
    Agent.update(pid, fn queue ->
      :queue.in(new_entry, queue)
    end)
  end

  def is_empty(pid) do
    :queue.is_empty(Agent.get(pid, &Function.identity/1))
  end

  def next(pid) do
    Agent.get_and_update(pid, fn queue ->
      case :queue.out(queue) do
        {{:value, song}, new_queue} ->
          {song, new_queue}

        res = {:empty, _queue} ->
          res
      end
    end)
  end

  def fetch(pid) do
    Agent.get(pid, &Function.identity/1)
  end

  def current(pid) do
    res = Agent.get(pid, fn queue -> :queue.peek(queue) end)

    case res do
      {:value, song} -> song
      _ -> :empty
    end
  end
end
