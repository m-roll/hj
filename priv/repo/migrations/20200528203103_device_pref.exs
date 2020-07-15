defmodule Hj.Repo.Migrations.DevicePref do
  use Ecto.Migration

  def change do
    alter table(:hj_user_prefs) do
      add(:playback_device_id, :string)
    end
  end
end
