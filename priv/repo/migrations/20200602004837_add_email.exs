defmodule Hj.Repo.Migrations.AddEmail do
  use Ecto.Migration

  def change do
    alter table(:hj_users) do
      add(:email, :string, null: false)
    end

    create(unique_index(:hj_users, [:email]))
  end
end
