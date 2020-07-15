defmodule Hj.Repo.Migrations.SeparatePrefs do
  use Ecto.Migration

  def change do
    alter table(:hj_user_prefs) do
      remove(:first_name)
    end

    alter table(:hj_users) do
      add(:display_name, :string, null: false)
    end
  end
end
