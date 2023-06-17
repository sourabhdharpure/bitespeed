#!/bin/sh

set -e

# if [ $1 == 'migration' ]
# then
until nc -z $DB_HOST $DB_PORT; do echo "db is not connected yet" && sleep 1; done

echo "Running migration"
node src/migration.js &

pid=$!

wait $pid

node src/index.js
# fi
