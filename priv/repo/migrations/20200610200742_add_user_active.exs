defmodule Hj.Repo.Migrations.AddUserActive do
  use Ecto.Migration

  def change do
    alter table(:hj_users) do
      add(:currently_active, :boolean, null: false, default: false)
    end
  end
end
