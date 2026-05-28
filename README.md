# VoiceScript — Court Reporting Workflow Manager

A full-stack workflow system for managing court transcription jobs, reporter/editor assignments, and payment tracking.

## Stack

- **Backend**: Node.js + TypeScript + Express + Prisma ORM
- **Database**: PostgreSQL (Docker)
- **Frontend**: React + TypeScript + Vite

## Quick Start

### 1. Start the database

```bash
docker compose up -d
```

### 2. Run the backend

```bash
cd backend
yarn dev          # dev server on http://localhost:3001
```

On first run (or after `docker compose down -v`), set up the DB:

```bash
yarn db:push      # sync schema
yarn db:seed      # seed reporters + editors
```

### 3. Run the frontend

```bash
cd frontend
yarn dev          # http://localhost:3000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/jobs` | List all jobs |
| POST | `/api/jobs` | Create a job |
| POST | `/api/jobs/:id/assign-reporter` | Assign reporter (status: NEW → ASSIGNED) |
| POST | `/api/jobs/:id/assign-editor` | Assign editor (status: TRANSCRIBED → REVIEWED) |
| PATCH | `/api/jobs/:id/status` | Advance status |
| GET | `/api/reporters` | List reporters |
| GET | `/api/reporters/suggest/:jobId` | Suggest reporters (same-city first) |
| GET | `/api/editors` | List editors |
| GET | `/api/payments` | Payment summary (REVIEWED + COMPLETED jobs) |

## Status Flow

```
NEW → ASSIGNED → TRANSCRIBED → REVIEWED → COMPLETED
```

## Payment Rules

- Reporter: `duration (min) × ratePerMinute` (default 2000 IDR/min)
- Editor: flat fee per job (default 50,000 IDR)

