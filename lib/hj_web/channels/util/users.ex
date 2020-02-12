defmodule HjWeb.Socket.Util.Users do
  def spotify_access_token_from_payload(payload) do
    payload["spotifyAccessToken"]
  end

  def device_id_from_payload(payload) do
    payload["deviceId"]
  end
end
