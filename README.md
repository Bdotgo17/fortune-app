# The Fortune Teller

A mystical fortune-telling web app. Click a button, receive your fortune.

## What it is

A simple, free web app with a dark purple/gold aesthetic where visitors can reveal a personal fortune. No sign-up, no payment — just click and discover what the universe has to say.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Express (Node.js)
- **Monorepo**: pnpm workspaces + TypeScript
- **Database**: PostgreSQL + Drizzle ORM

## Project Structure

```
artifacts/
  fortune/        # React frontend
  api-server/     # Express API
lib/
  db/             # Shared database schema (Drizzle ORM)
```

## Running Locally

Install dependencies:

```bash
pnpm install
```

Start the API server:

```bash
pnpm --filter @workspace/api-server run dev
```

Start the frontend:

```bash
pnpm --filter @workspace/fortune run dev
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/fortune/reveal` | Returns a random fortune |
| GET | `/api/healthz` | Health check |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Port for the API server |
