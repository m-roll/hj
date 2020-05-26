defmodule HillsideJukebox.Device do
  @derive {Jason.Encoder, only: [:id, :name, :type]}
  defstruct [:id, :name, :type]

  def from(%Spotify.Player.Device{id: id, name: name, type: type}) do
    %HillsideJukebox.Device{id: id, name: name, type: type}
  end
end
