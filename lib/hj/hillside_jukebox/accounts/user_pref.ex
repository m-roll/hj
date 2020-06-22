defmodule HillsideJukebox.UserPref do
  use Ecto.Schema

  @foreign_key_type :string
  @primary_key {:id, :binary_id, autogenerate: true}
  schema "hj_user_prefs" do
    belongs_to(:user, HillsideJukebox.User)
    field(:nickname, :string)
    field(:playback_device_id, :string)
  end
end
