defmodule HillsideJukebox.User do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  @foreign_key_type :id
  schema "hj_users" do
    has_one(:hj_user_prefs, HillsideJukebox.UserPref, on_delete: :delete_all)
    field(:display_name, :string)
    field(:email, :string)
    field(:access_token, :string)
    field(:refresh_token, :string)
    field(:expires_at, :naive_datetime)
    field(:scope, {:array, :string})
  end
end
