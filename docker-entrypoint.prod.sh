#!/bin/sh
set -e

./prisma-migrate-deploy.sh

exec "$@"
