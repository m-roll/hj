defmodule Hj.Repo do
  use Ecto.Repo,
    otp_app: :hj,
    adapter: Ecto.Adapters.Postgres
end
