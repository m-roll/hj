defmodule HillsideJukebox.SongQueue.Server do
  require Logger
  use Agent

  @moduledoc """
  Maintains the state of a queue [of songs]. First in, first out.
  This queue contains elements of the form {song, track_info_map}
  """

  @doc """
  Initiate the queue with some initial queue. Queue data structure should
  look like and erlang :queue.
  """
  def start_link(initial_queue) do
    Agent.start_link(fn -> initial_queue end)
  end

  @doc """
  Add an entry to the queue.
  """
  def add(pid, new_entry) do
    Agent.update(pid, fn queue ->
      :queue.in(new_entry, queue)
    end)
  end

  @doc """
  Returns false if there is some element in the queue. True otherwise.
  """
  def is_empty(pid) do
    :queue.is_empty(Agent.get(pid, &Function.identity/1))
  end

  @doc """
  Pops the next element from the queue and returns that element.
  :empty if the queue is empty.
  """
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

  @doc """
  Fetches the entire queue. Data is shaped like an erlang :queue
  """
  def fetch(pid) do
    Agent.get(pid, &Function.identity/1)
  end

  @doc """
  Peeks the topmost value of the queue. Does not alter the queue.
  """
  def current(pid) do
    res = Agent.get(pid, fn queue -> :queue.peek(queue) end)

    case res do
      {:value, song} -> song
      _ -> :empty
    end
  end
end
