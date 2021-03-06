defmodule HjWeb.AnonUserChannel do
  use Phoenix.Channel

  def join("user_anon:" <> _room_code, _payload, socket) do
    {:ok, socket}
  end

  def handle_in("user_anon:vote_skip", _payload, socket) do
    HillsideJukebox.JukeboxServer.vote_skip(room_code(socket), socket_identity(socket))
    |> get_skip_response(socket)
  end

  def handle_in("user_anon:unvote_skip", _payload, socket) do
    HillsideJukebox.JukeboxServer.unvote_skip(room_code(socket), socket_identity(socket))
    |> get_skip_response(socket)
  end

  def handle_in("user_anon:vote_status", _payload, socket) do
    has_voted =
      HillsideJukebox.JukeboxServer.vote_skip_status(room_code(socket), socket_identity(socket))

    {:reply, {:ok, %{has_voted: has_voted}}, socket}
  end

  def handle_in("user_anon:get_prefs", _payload, socket) do
    skip_thresh = HillsideJukebox.JukeboxServer.get_skip_thresh(room_code(socket))
    {:reply, {:ok, %{skip_thresh: skip_thresh}}, socket}
  end

  defp get_skip_response({:ok, skip_details} = ok_tuple, socket) do
    has_voted =
      HillsideJukebox.JukeboxServer.vote_skip_status(room_code(socket), socket_identity(socket))

    {:reply, {:ok, Map.put(skip_details, :has_voted, has_voted)}, socket}
  end

  defp get_skip_response({:error, err_message}, socket) do
    {:reply, {:ok, %{error_message: err_message}}, socket}
  end

  defp socket_identity(socket) do
    socket.join_ref
  end

  defp room_code(socket) do
    %Phoenix.Socket{topic: "user_anon:" <> room_code} = socket
    room_code
  end
end
