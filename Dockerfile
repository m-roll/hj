FROM elixir:1.10.2-alpine AS build

# install build dependencies
RUN apk add --no-cache build-base npm git python

# prepare build dir
RUN mkdir /app
WORKDIR /app

# install hex + rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# set build ENV
ENV MIX_ENV=prod

# install mix dependencies
COPY mix.exs mix.lock ./
COPY config config
# have to do this since the certificate at git.waitstreet.com keeps expiring
RUN git config --global http.sslVerify false
RUN mix hex.config unsafe_https true

RUN mix do deps.get --only $MIX_ENV
RUN mix deps.compile

# build assets
COPY assets/package.json assets/package-lock.json ./assets/
RUN npm --prefix ./assets ci --progress=false --no-audit --loglevel=error

COPY priv priv
COPY assets assets
RUN npm run --prefix ./assets deploy
RUN mix phx.digest

# compile and build release
COPY lib lib
# uncomment COPY if rel/ exists
# COPY rel rel
RUN mix do compile, release

# prepare release image
FROM alpine:3.9 AS app
RUN apk add --no-cache bash openssl ncurses-libs postgresql-client

WORKDIR /app

RUN chown nobody:nobody /app

USER nobody:nobody

COPY --from=build --chown=nobody:nobody /app/_build/prod/rel/hj ./

COPY entrypoint.sh .
USER nobody
ENV HOME=/app

CMD ["bash", "/app/entrypoint.sh"]