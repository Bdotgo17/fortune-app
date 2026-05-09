# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

- **Fortune App** (`artifacts/fortune`) — served at `/`
- **API Server** (`artifacts/api-server`) — served at `/api`
- **Daily Crossword** (`artifacts/crossword`) — served at `/crossword/`

## Product — Daily Crossword (`artifacts/crossword`)

A daily crossword puzzle (11×11 grid) that rotates through 5 pre-written puzzles keyed by date.

Grid structure: full black row at r5 + full black col at c5 creates four independent 5×5 word squares (TL/TR/BL/BR). All 40 entries per puzzle are exactly 5 letters. The engine supports any grid size via `puzzle.size`.

Key files:
- `artifacts/crossword/src/lib/puzzles.ts` — 5 static 11×11 puzzles + `buildPuzzle()` helper + date→puzzle mapping
- `artifacts/crossword/src/lib/engine.ts` — pure utilities (entry lookup, validation, navigation) — no changes needed for grid size
- `artifacts/crossword/src/lib/storage.ts` — localStorage persistence keyed by date
- `artifacts/crossword/src/context/CrosswordContext.tsx` — useReducer state store + timer
- `artifacts/crossword/src/components/CrosswordGrid.tsx` — interactive grid
- `artifacts/crossword/src/components/CluesPanel.tsx` — Across/Down clue list
- `artifacts/crossword/src/components/Toolbar.tsx` — header, timer, action buttons
- `artifacts/crossword/src/components/CompletionModal.tsx` — solved modal

## User preferences

_None recorded yet_

## Gotchas

- All word squares are verified: row words = col words (word-square symmetry). No manual intersection checks needed.
- The crossword uses `localStorage` keyed by date (`crossword_progress_YYYY-MM-DD`) — no server/database.
- `src/components/ui/` was intentionally removed. Do not recreate it; use plain HTML/Tailwind instead.
- `use-toast.ts` defines its own `ToastProps` locally (no longer imports from the deleted ui/ directory).
