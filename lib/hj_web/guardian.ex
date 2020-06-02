defmodule HjWeb.Guardian do
  use Guardian, otp_app: :hj

  alias Hj.Repo
  alias HillsideJukebox.User

  def subject_for_token(resource = %User{}, _claims) do
    sub = to_string(resource.id)
    {:ok, sub}
  end

  def resource_from_claims(claims) do
    # Here we'll look up our resource from the claims, the subject can be
    # found in the `"sub"` key. In `above subject_for_token/2` we returned
    # the resource id so here we'll rely on that to look it up.
    id = claims["sub"]
    user = HillsideJukebox.Accounts.get(id)
    {:ok, user}
  end
end
