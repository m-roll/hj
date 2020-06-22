defmodule HillsideJukebox.UserPreferences do
  alias HillsideJukebox.{User, UserPref}
  alias Hj.Repo
  import Ecto.Query

  def create_default(user = %User{id: user_id}) do
    default_pref = %UserPref{
      nickname: user.display_name,
      playback_device_id: nil,
      user_id: user_id
    }

    Repo.insert(default_pref)
  end

  def get_or_create(user) do
    case get(user) do
      nil -> create_default(user)
      result -> result
    end
  end

  def get(user = %User{id: user_id}) do
    Repo.one(query_prefs_by_user_id(user_id))
  end

  def save(user = %User{id: user_id}, new_prefs) do
    current_prefs = get_or_create(user)

    current_prefs
    |> Ecto.Changeset.cast(new_prefs, [:nickname])
    |> process_changes(current_prefs)
    |> Repo.update()
  end

  defp process_changes(changeset, %UserPref{user_id: uid, playback_device_id: did} = prefs) do
    if Map.has_key?(changeset, :playback_device_id) do
      if did != (new_did = Map.get(changeset, :playback_device_id)) do
        HillsideJukebox.Accounts.get(uid)
        |> update_device_id(new_did)
      end
    end

    changeset
  end

  defp update_device_id(%HillsideJukebox.User{access_token: at}, new_did) do
    DeSpotify.Player.transfer_device(at, [new_did])
  end

  defp query_prefs_by_user_id(user_id) do
    from(p in HillsideJukebox.UserPref,
      where: p.user_id == ^user_id
    )
  end
end
