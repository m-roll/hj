defmodule HillsideJukebox.SongQueue.ServerTest do
  use ExUnit.Case
  doctest HillsideJukebox.SongQueue.Server
  alias HillsideJukebox.SongQueue
  alias HillsideJukebox.Song

  setup do
    {:ok, queue_pid} = SongQueue.Server.start_link(:queue.new())
    {:ok, queue_pid: queue_pid}
  end

  test "empty gives true for empty queue", %{queue_pid: pid} do
    assert true == SongQueue.Server.is_empty(pid)
  end

  test "empty gives false after queue populated", %{queue_pid: pid} do
    SongQueue.Server.add(pid, %Song{})
    assert false == SongQueue.Server.is_empty(pid)
  end

  test "current song reports empty when queue empty", %{queue_pid: pid} do
    assert :empty = SongQueue.Server.current(pid)
  end

  test "current doesn't pop first element", %{queue_pid: pid} do
    SongQueue.Server.add(pid, %Song{id: 1})
    SongQueue.Server.add(pid, %Song{id: 2})
    current = SongQueue.Server.current(pid)
    new_current = SongQueue.Server.current(pid)
    assert %Song{id: 1} == current
    assert current == new_current
  end

  test "getting next song pops first element", %{queue_pid: pid} do
    SongQueue.Server.add(pid, %Song{id: 1})
    SongQueue.Server.add(pid, %Song{id: 2})
    next_song = SongQueue.Server.next(pid)
    current_after_pop = SongQueue.Server.current(pid)
    assert next_song == %Song{id: 1}
    assert current_after_pop == %Song{id: 2}
  end

  test "fetch gets entire populated queue", %{queue_pid: pid} do
    SongQueue.Server.add(pid, %Song{id: 1})
    SongQueue.Server.add(pid, %Song{id: 2})
    SongQueue.Server.add(pid, %Song{id: 3})
    assert {[%Song{id: 3}, %Song{id: 2}], [%Song{id: 1}]} == SongQueue.Server.fetch(pid)
  end
end
