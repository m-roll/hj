defmodule HillsideJukebox.Accounts do
  import Ecto.Query
  alias HillsideJukebox.User
  alias Hj.Repo

  @spec create(tokens :: %DeSpotify.Auth.Tokens{}, user :: %DeSpotify.PrivateUser{}) ::
          {:ok, %HillsideJukebox.User{}}
  def create(tokens, user) do
    user_struct = user_struct(tokens, user)
    do_create(user_struct)
  end

  # Creates both a user and the preferences for that user, this is important
  defp do_create(user) do
    {:ok, new_user} = Repo.insert(user)
    HillsideJukebox.UserPreferences.create_default(new_user)
  end

  @spec create(tokens :: %DeSpotify.Auth.Tokens{}, user :: %DeSpotify.PrivateUser{}) ::
          {:ok, %HillsideJukebox.User{}}
  def register_or_update_auth(
        tokens = %DeSpotify.Auth.Tokens{access_token: at, refresh_token: rt},
        spotify_user
      ) do
    new_user = %User{id: id} = user_struct(tokens, spotify_user)

    if exists?(new_user) do
      existing_user = get(id)
      update_access_and_refresh_token(existing_user, at, rt)
    else
      do_create(new_user)
    end
  end

  def update_access_token(user, new_access_token) do
    user
    |> Ecto.Changeset.cast(%{access_token: new_access_token}, [:access_token])
    |> Repo.update()
  end

  def update_access_and_refresh_token(user, new_access_token, new_refresh_token) do
    user
    |> Ecto.Changeset.cast(%{access_token: new_access_token, refresh_token: new_refresh_token}, [
      :access_token,
      :refresh_token
    ])
    |> Repo.update()
  end

  def set_active_room(user, active_room) do
    user
    |> Ecto.Changeset.cast(%{room_active: active_room}, [
      :room_active
    ])
    |> Repo.update()
  end

  def get_by_email(email) do
    Repo.one(query_user_by_email(email))
  end

  def get(user_id) do
    Repo.one(query_user_by_id(user_id))
  end

  @spec exists?(user :: %User{}) :: boolean
  def exists?(user = %User{email: email}) when is_struct(user), do: exists?(email)

  @spec exists?(email :: String.t()) :: boolean
  def exists?(email) do
    Repo.exists?(query_user_by_email(email))
  end

  defp user_struct(
         %DeSpotify.Auth.Tokens{access_token: at, refresh_token: rt},
         %DeSpotify.PrivateUser{id: id, display_name: dn, email: email}
       ) do
    %HillsideJukebox.User{
      id: id,
      access_token: at,
      refresh_token: rt,
      display_name: dn,
      email: email
    }
  end

  defp query_user_by_id(user_id) do
    from(u in HillsideJukebox.User,
      where: u.id == ^user_id
    )
  end

  defp query_user_by_email(email) do
    from(u in HillsideJukebox.User,
      where: u.email == ^email
    )
  end
end
