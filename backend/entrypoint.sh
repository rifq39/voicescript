#!/bin/sh
set -e

echo "→ Running prisma db push..."
npx prisma db push

REPORTER_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.reporter.count().then(n => { console.log(n); return p.\$disconnect(); }).catch(() => { console.log(0); });
" 2>/dev/null)

if [ "$REPORTER_COUNT" = "0" ]; then
  echo "→ Seeding database (first run)..."
  yarn db:seed
else
  echo "→ Database already seeded, skipping."
fi

echo "→ Starting server..."
exec node dist/index.js
