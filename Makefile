.PHONY: install setup up down build rebuild logs ps seed migrate dev-db

# Install all dependencies locally (backend + frontend)
install:
	cd backend && yarn install
	cd frontend && yarn install

# Fresh start: install deps then build images and start all services
setup: install
	docker compose up -d --build

# Start all services (assumes images already built)
up:
	docker compose up -d

# Stop all services
down:
	docker compose down

# Build images without cache
build:
	docker compose build

# Rebuild images and restart (use after code changes)
rebuild:
	docker compose up -d --build

# Follow logs from all containers (or pass service: make logs s=backend)
logs:
	docker compose logs -f $(s)

# Show running containers
ps:
	docker compose ps

# Seed the database (runs inside the backend container)
seed:
	docker compose exec backend yarn db:seed

# Push prisma schema changes to the database
migrate:
	docker compose exec backend npx prisma db push

# Start only postgres locally (for local backend/frontend dev with yarn dev)
dev-db:
	docker compose up -d postgres
