defmodule HillsideJukebox.Accounts do
  import Ecto.Query
  alias HillsideJukebox.User
  alias Hj.Repo

  @spec create(tokens :: %DeSpotify.Auth.Tokens{}, user :: %DeSpotify.PrivateUser{}) ::
          {:ok, %HillsideJukebox.User{}}
  def create(tokens, user) do
    Repo.insert(user_struct(tokens, user))
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
      Repo.insert(new_user)
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
    {id_int, _} = Integer.parse(id)

    %HillsideJukebox.User{
      id: id_int,
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