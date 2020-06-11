defmodule HjWeb.AnonUserSocket do
  use Phoenix.Socket

  def connect(params, socket, _connect_info) do
    {:ok, assign(socket, :room_code, params["room_code"])}
  end

  def id(_socket) do
    nil
  end

  channel("queue:*", HjWeb.QueueChannel)
  channel("status:*", HjWeb.StatusChannel)
  channel("room", HjWeb.RoomChannel)
  channel("search:*", HjWeb.SearchChannel)
  channel("user_anon:*", HjWeb.AnonUserChannel)
end
