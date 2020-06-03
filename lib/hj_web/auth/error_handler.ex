defmodule HjWeb.Auth.ErrorHandler do
  use Phoenix.Controller
  import Plug.Conn

  def auth_error(conn, error = {type, _reason}, opts) do
    case type do
      :unauthenticated -> redirect(conn, to: "/authorize")
      _ -> other_error(conn, error, opts)
    end
  end

  defp other_error(conn, {type, _reason}, _opts) do
    body = to_string(type)

    conn
    |> put_resp_content_type("text/plain")
    |> send_resp(401, body)
  end
end
