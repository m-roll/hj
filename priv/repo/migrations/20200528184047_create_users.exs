defmodule Hj.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:hj_users, primary_key: false) do
      add(:id, :string, size: 20, primary_key: true)
      add(:access_token, :string)
      add(:refresh_token, :string)
      add(:expires_at, :timestamp)
      add(:scope, {:array, :binary})
      add(:spotify_user_id, :string)
    end
  end
end
