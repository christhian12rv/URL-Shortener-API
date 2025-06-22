echo "Running database migrations..."

cd packages/shared && npx prisma migrate dev --schema=prisma/schema.prisma && cd ../..

echo "Migrations successful applied!"
