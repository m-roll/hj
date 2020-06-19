defmodule HillsideJukebox.UserPref do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  schema "hj_user_prefs" do
    belongs_to(:hj_users, HillsideJukebox.User)
    field(:nickname, :string)
    field(:playback_device_id, :string)
  end

  def update(prefs = %__MODULE__{}, changes) do
    prefs
    |> process_changes(changes)
    |> __MODULE__.changeset(changes)
    |> __MODULE__.Repo.update()
  end

  defp process_changes(%__MODULE__{hj_users_id: uid, playback_device_id: did} = prefs, changeset) do
    if Map.has_key?(changeset, :playback_device_id) do
      if did != (new_did = Map.get(changeset, :playback_device_id)) do
        HillsideJukebox.Accounts.get(uid)
        |> update_device_id(new_did)
      end
    end

    prefs
  end

  defp update_device_id(%HillsideJukebox.User{access_token: at}, new_did) do
    DeSpotify.Player.transfer_device(at, [new_did])
  end
end
