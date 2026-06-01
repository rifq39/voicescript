# VoiceScript — Court Reporting Workflow Manager

A full-stack workflow system for court reporting agencies to manage transcription jobs, assign reporters and editors, track job status, and calculate payments.

## Features

- Create jobs with case name, duration, and location type (physical/remote)
- Smart reporter suggestions — same-city reporters ranked first for physical jobs
- Job status pipeline: **NEW → ASSIGNED → TRANSCRIBED → REVIEWED → COMPLETED**
- Assign reporters (NEW→ASSIGNED) and editors (TRANSCRIBED→REVIEWED) per job
- Payment summary with per-job and total breakdowns (reporter + editor fees)
- Filter jobs by status; tabs for Jobs and Payments views

## Architecture

The backend follows **Clean Architecture** with four explicit layers:

```
src/
├── domain/          # Entities + repository interfaces (no framework deps)
├── application/     # Use cases — one class per business action
├── infrastructure/  # Prisma implementations of repository interfaces
└── interfaces/      # Express controllers + route wiring
```

All dependency arrows point inward: use cases depend only on domain interfaces, never on Prisma or Express directly. This makes use cases trivially unit-testable with Jest mocks.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js · TypeScript · Express |
| ORM | Prisma |
| Database | PostgreSQL 16 (Docker) |
| Frontend | Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui |
| Testing | Jest |
| Containers | Docker Compose |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) + Docker Compose
- Node.js 18+ and [Yarn](https://yarnpkg.com/) (for local dev only)

---

## Quickstart — Docker (recommended)

One command to build and start everything (DB + backend + frontend):

```bash
make setup
```

Then seed the database:

```bash
make seed
```

Open **http://localhost:3000** in your browser.

> `make setup` = `yarn install` in both workspaces + `docker compose up -d --build`

### Other useful Make targets

```bash
make up        # start services (images already built)
make down      # stop services
make rebuild   # rebuild images after code changes
make logs      # tail all container logs  (make logs s=backend for one service)
make seed      # (re-)seed reporters and editors
make migrate   # push Prisma schema changes to DB
make test      # run backend unit tests
```

---

## Local Development (without Docker for app code)

Useful for faster iteration — only the database runs in Docker.

```bash
# 1. Start only the database
make dev-db

# 2. Backend
cd backend
cp .env.example .env   # already pre-filled for the Docker postgres
yarn install
yarn db:push           # sync Prisma schema
yarn db:seed           # seed reporters + editors
yarn dev               # http://localhost:3001

# 3. Frontend (separate terminal)
cd frontend
yarn install
yarn dev               # http://localhost:3000
```

> The frontend proxies `/api/*` to `http://localhost:3001` via `next.config.mjs`.

### Environment variables

`backend/.env` (already committed with defaults for Docker postgres):

```
DATABASE_URL="postgresql://voicescript:voicescript123@localhost:5432/voicescript"
PORT=3001
```

---

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/jobs` | List all jobs |
| `POST` | `/api/jobs` | Create a job |
| `POST` | `/api/jobs/:id/assign-reporter` | Assign reporter (NEW → ASSIGNED) |
| `POST` | `/api/jobs/:id/assign-editor` | Assign editor (TRANSCRIBED → REVIEWED) |
| `PATCH` | `/api/jobs/:id/status` | Advance status by one step |
| `GET` | `/api/reporters` | List all reporters |
| `GET` | `/api/reporters/suggest/:jobId` | Suggested reporters (same-city first) |
| `GET` | `/api/editors` | List all editors |
| `GET` | `/api/payments` | Payment summary (REVIEWED + COMPLETED jobs only) |

### Sample outputs

**`GET /api/jobs`**
```json
[
  {
    "id": 1,
    "caseName": "State v. Hartono",
    "duration": 90,
    "locationType": "physical",
    "city": "Jakarta",
    "status": "ASSIGNED",
    "reporter": { "id": 1, "name": "Budi Santoso", "city": "Jakarta" },
    "editor": null,
    "createdAt": "2026-05-30T08:00:00.000Z"
  }
]
```

**`GET /api/reporters/suggest/1`** (physical job in Jakarta)
```json
[
  { "id": 1, "name": "Budi Santoso",  "city": "Jakarta",  "available": true, "ratePerMinute": 2000 },
  { "id": 4, "name": "Dewi Lestari",  "city": "Jakarta",  "available": true, "ratePerMinute": 2500 },
  { "id": 3, "name": "Ahmad Fauzi",   "city": "Bandung",  "available": true, "ratePerMinute": 2000 },
  { "id": 2, "name": "Siti Rahayu",   "city": "Surabaya", "available": true, "ratePerMinute": 2000 }
]
```

**`GET /api/payments`**
```json
{
  "jobs": [
    {
      "jobId": 1,
      "caseName": "State v. Hartono",
      "duration": 90,
      "reporterName": "Budi Santoso",
      "editorName": "Rina Marlina",
      "reporterPay": 180000,
      "editorPay": 50000,
      "totalPay": 230000
    }
  ],
  "totals": {
    "reporterPay": 180000,
    "editorPay": 50000,
    "total": 230000
  }
}
```

---

## Payment Rules

- **Reporter fee**: `duration (minutes) × ratePerMinute` (default: 2,000 IDR/min)
- **Editor fee**: flat fee per job (default: 50,000 IDR)
- Only jobs with status `REVIEWED` or `COMPLETED` appear in the payment summary

---

## Testing

```bash
make test
# or from the backend directory:
cd backend && yarn test
```

The test suite covers the three core use cases with unit tests (no database required):

| Test file | Coverage |
|-----------|---------|
| `assign-reporter.test.ts` | Status guard, reporter availability toggle |
| `suggest-reporters.test.ts` | City ranking, alphabetical sort, remote jobs |
| `get-payments.test.ts` | Fee calculation, totals, empty states |

```
PASS src/__tests__/assign-reporter.test.ts
PASS src/__tests__/suggest-reporters.test.ts
PASS src/__tests__/get-payments.test.ts

Test Suites: 3 passed, 3 total
Tests:       29 passed, 29 total
```

---

## Project Structure

```
voicescript/
├── backend/
│   ├── prisma/schema.prisma     # Reporter, Editor, Job models
│   ├── seed/seed.ts             # 4 reporters + 2 editors
│   └── src/
│       ├── domain/              # Entities + repository interfaces
│       ├── application/         # Use cases (business logic)
│       ├── infrastructure/      # Prisma repo implementations
│       └── interfaces/http/     # Express controllers + routes
├── frontend/
│   ├── app/page.tsx             # Main page (Jobs + Payments tabs)
│   └── components/
│       ├── job-card.tsx         # Job card with status + actions
│       ├── assign-modal.tsx     # Reporter/editor assignment
│       ├── new-job-modal.tsx    # Create job form
│       └── payment-summary.tsx  # Payment breakdown table
├── docker-compose.yml           # postgres + backend + frontend
└── Makefile                     # Developer shortcuts
```
