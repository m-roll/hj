# File: hj/entrypoint.sh
#!/bin/bash
# docker entrypoint script.

# wait until Postgres is ready
#while ! pg_isready -q -h $POSTGRES_HOSTNAME -p 5432 -U $POSTGRES_USERNAME
#do
#  echo "$(date) - waiting for database to start"
#  sleep 2
#done

sleep 5

bin="/app/bin/hj"
eval "$bin eval \"HillsideJukebox.Release.migrate\""
# start the elixir application
exec "$bin" "start"