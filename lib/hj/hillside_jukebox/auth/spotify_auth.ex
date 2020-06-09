defmodule HillsideJukebox.Auth.Spotify do
  defstruct ~w[
    has_authenticated
    access_token
    expires_at
  ]a
  use Agent

  def start_link(_) do
    Agent.start_link(fn -> %HillsideJukebox.Auth.Spotify{has_authenticated: false} end,
      name: __MODULE__
    )
  end

  # When choosing arity to pass in, use the arity + 1. The creds will be appended to the first
  def call_for_user(
        user = %HillsideJukebox.User{access_token: access_token, refresh_token: refresh_token},
        fun,
        args
      ) do
    res = apply(fun, [access_token | args])

    case res do
      {:error, %DeSpotify.Error{status: 401}} ->
        {:ok, %{"access_token" => new_access_token}} = DeSpotify.Auth.refresh(refresh_token)
        HillsideJukebox.Accounts.update_access_token(user, new_access_token)
        apply(fun, [new_access_token | args])

      _ ->
        res
    end
  end

  def call_for_client(fun, args) do
    Agent.get_and_update(
      __MODULE__,
      fn cur_state = %__MODULE__{
           has_authenticated: init,
           access_token: at,
           expires_at: expires_at
         } ->
        current_time = get_time_ms()

        if init && current_time < expires_at do
          call_result = apply(fun, [at | args])
          {call_result, cur_state}
        else
          case get_new_client_access() do
            %{access_token: at, expires_in: expires_in} ->
              new_state = %__MODULE__{
                has_authenticated: true,
                access_token: at,
                expires_at: current_time + expires_in
              }

              call_result = apply(fun, [at | args])
              {call_result, new_state}

            error_tuple ->
              {error_tuple, cur_state}
          end
        end
      end
    )
  end

  defp get_new_client_access() do
    case DeSpotify.Auth.authenticate_client() do
      {:ok, %{"access_token" => at, "expires_in" => expires_in}} ->
        %{access_token: at, expires_in: expires_in}

      error_tuple ->
        error_tuple
    end
  end

  defp get_time_ms() do
    System.convert_time_unit(System.system_time(), :native, :millisecond)
  end
end
