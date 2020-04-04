defmodule HillsideJukebox.Room.CodesRegistryTest do
  use ExUnit.Case
  doctest HillsideJukebox.Room.CodesRegistry

  test "code do not exist on startup" do
    assert false == HillsideJukebox.Room.CodesRegistry.exists?('test')
  end

  test "code does exist after creating" do
    new_code = HillsideJukebox.Room.CodesRegistry.take()
    code_charlist = String.to_charlist(new_code)
    assert true == HillsideJukebox.Room.CodesRegistry.exists?(code_charlist)
  end

  test "code does not exist after retiring" do
    new_code = HillsideJukebox.Room.CodesRegistry.take()
    code_charlist = String.to_charlist(new_code)
    HillsideJukebox.Room.CodesRegistry.retire(code_charlist)
    assert false == HillsideJukebox.Room.CodesRegistry.exists?(code_charlist)
  end
end
