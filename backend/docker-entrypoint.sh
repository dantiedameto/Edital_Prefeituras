#!/bin/sh
set -e

echo "Aguardando banco de dados aplicar migrations..."
npx prisma migrate deploy

echo "Rodando seed (idempotente)..."
npx prisma db seed || true

echo "Iniciando backend..."
exec node dist/main
