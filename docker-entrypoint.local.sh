#!/bin/sh
set -e

./prisma-migrate-dev.sh

exec "$@"
