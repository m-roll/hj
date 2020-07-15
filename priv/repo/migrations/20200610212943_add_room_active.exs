defmodule Hj.Repo.Migrations.AddRoomActive do
  use Ecto.Migration

  def change do
    alter table(:hj_users) do
      remove(:currently_active)
      add(:room_active, :string)
    end
  end
end
