defmodule Hj.Repo.Migrations.UserPrefs do
  use Ecto.Migration

  def change do
    create table(:hj_user_prefs, primary_key: false) do
      add(:id, :binary_id, primary_key: true)
      add(:first_name, :string, null: false)
      add(:nickname, :string, null: false)
      add(:user_id, references("hj_users", on_delete: :delete_all, type: :string))
    end
  end
end
