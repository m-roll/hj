defmodule HillsideJukebox.Room.CodesRegistry do
  use Agent

  # make this an environment variable
  @code_length 4
  # make this an environment variable too
  @valid_chars 'abcdefghijklmnopqrstuvwxyz'

  def start_link(_) do
    Agent.start_link(
      fn -> generate_room_codes(@valid_chars, @code_length) end,
      name: __MODULE__
    )
  end

  def take() do
    Agent.get_and_update(__MODULE__, fn room_map ->
      {room_code, new_map} = take(room_map)
      {List.to_string(room_code), new_map}
    end)
  end

  def exists?(code) do
    Agent.get(__MODULE__, &exists?(&1, code))
  end

  def retire(code) do
    Agent.update(__MODULE__, &retire(&1, code))
  end

  defp take(:end) do
    {[], :end}
  end

  defp take(map) when is_map(map) do
    next_char = Enum.random(Map.keys(map))
    inner = Map.fetch!(map, next_char)
    {subcode, result_inner} = take(inner)
    new_code = [next_char | subcode]

    case result_inner do
      map when map == %{} -> {new_code, Map.delete(map, next_char)}
      :end -> {new_code, Map.delete(map, next_char)}
      _ -> {new_code, Map.put(map, next_char, result_inner)}
    end
  end

  defp exists?(:end, []) do
    false
  end

  defp exists?(map, [first | rest]) do
    case Map.fetch(map, first) do
      {:ok, inner} -> exists?(inner, rest)
      _ -> true
    end
  end

  defp retire(:end, []) do
    :end
  end

  defp retire(map, [first | rest] = _str) when is_map(map) do
    case Map.fetch(map, first) do
      {:ok, inner_map} -> %{map | first => retire(inner_map, rest)}
      _ -> %{map | first => retire(%{}, rest)}
    end
  end

  defp generate_room_codes(chars, len) do
    case len do
      1 ->
        Enum.reduce(
          chars,
          %{},
          fn char, map -> Map.put(map, char, :end) end
        )

      _ ->
        Enum.reduce(
          chars,
          %{},
          fn char, map -> Map.put(map, char, generate_room_codes(chars, len - 1)) end
        )
    end
  end
end
