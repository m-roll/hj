defmodule HjWeb.Auth.Pipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :hj,
    error_handler: HjWeb.Auth.ErrorHandler,
    module: HjWeb.Guardian

  plug Guardian.Plug.VerifySession, claims: %{"typ" => "access"}
  plug Guardian.Plug.VerifyHeader, claims: %{"typ" => "access"}
  plug Guardian.Plug.LoadResource, allow_blank: true
end
