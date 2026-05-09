import type { CrosswordPuzzle, CrosswordEntry, CellPosition, Direction, CellState } from './types';

export function getEntryCells(entry: CrosswordEntry): CellPosition[] {
  const cells: CellPosition[] = [];
  for (let i = 0; i < entry.length; i++) {
    if (entry.direction === 'across') {
      cells.push({ row: entry.row, col: entry.col + i });
    } else {
      cells.push({ row: entry.row + i, col: entry.col });
    }
  }
  return cells;
}

export function getCellKey(row: number, col: number): string {
  return `${row},${col}`;
}

/** Returns a map of "row,col" -> display number for numbered cells */
export function computeCellNumbers(puzzle: CrosswordPuzzle): Map<string, number> {
  const map = new Map<string, number>();
  for (const entry of puzzle.entries) {
    const key = getCellKey(entry.row, entry.col);
    if (!map.has(key)) {
      map.set(key, entry.number);
    }
  }
  return map;
}

/** Find all entries that contain the given cell */
export function getEntriesForCell(
  puzzle: CrosswordPuzzle,
  row: number,
  col: number,
): CrosswordEntry[] {
  return puzzle.entries.filter((entry) => {
    const cells = getEntryCells(entry);
    return cells.some((c) => c.row === row && c.col === col);
  });
}

/** Get the entry for a given cell and direction (may be undefined) */
export function getActiveEntry(
  puzzle: CrosswordPuzzle,
  row: number,
  col: number,
  direction: Direction,
): CrosswordEntry | undefined {
  return puzzle.entries.find((e) => {
    if (e.direction !== direction) return false;
    const cells = getEntryCells(e);
    return cells.some((c) => c.row === row && c.col === col);
  });
}

/**
 * Given a cell and direction, find the "next" cell to move to after typing a letter.
 * Returns null if at the end of the entry.
 */
export function getNextCellInEntry(
  puzzle: CrosswordPuzzle,
  row: number,
  col: number,
  direction: Direction,
): CellPosition | null {
  const entry = getActiveEntry(puzzle, row, col, direction);
  if (!entry) return null;
  const cells = getEntryCells(entry);
  const idx = cells.findIndex((c) => c.row === row && c.col === col);
  if (idx < 0 || idx >= cells.length - 1) return null;
  return cells[idx + 1];
}

/**
 * Given a cell and direction, find the "previous" cell (for backspace).
 */
export function getPrevCellInEntry(
  puzzle: CrosswordPuzzle,
  row: number,
  col: number,
  direction: Direction,
): CellPosition | null {
  const entry = getActiveEntry(puzzle, row, col, direction);
  if (!entry) return null;
  const cells = getEntryCells(entry);
  const idx = cells.findIndex((c) => c.row === row && c.col === col);
  if (idx <= 0) return null;
  return cells[idx - 1];
}

/** Navigate via arrow keys — returns the adjacent white cell or null */
export function navigateArrow(
  puzzle: CrosswordPuzzle,
  row: number,
  col: number,
  arrowDir: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight',
): CellPosition | null {
  const deltas: Record<string, [number, number]> = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1],
  };
  const [dr, dc] = deltas[arrowDir];
  const nr = row + dr;
  const nc = col + dc;
  if (nr < 0 || nr >= puzzle.size || nc < 0 || nc >= puzzle.size) return null;
  if (puzzle.grid[nr][nc] === null) return null;
  return { row: nr, col: nc };
}

/** Check whether the user's answers are all correct and complete */
export function checkCompletion(
  puzzle: CrosswordPuzzle,
  userGrid: CellState[][],
): boolean {
  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      const correct = puzzle.grid[r][c];
      if (correct === null) continue; // black cell
      const cell = userGrid[r][c];
      if (!cell.letter || cell.letter.toUpperCase() !== correct.toUpperCase()) {
        return false;
      }
    }
  }
  return true;
}

/** Check which cells are incorrect (user has typed something wrong) */
export function checkIncorrectCells(
  puzzle: CrosswordPuzzle,
  userGrid: CellState[][],
): Set<string> {
  const incorrect = new Set<string>();
  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      const correct = puzzle.grid[r][c];
      if (correct === null) continue;
      const cell = userGrid[r][c];
      if (cell.letter && cell.letter.toUpperCase() !== correct.toUpperCase()) {
        incorrect.add(getCellKey(r, c));
      }
    }
  }
  return incorrect;
}

/** Format seconds as M:SS */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Format a Date as YYYY-MM-DD */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Format a date string as "Monday, May 6, 2026" */
export function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Determine which direction to prefer when clicking a cell */
export function preferredDirection(
  puzzle: CrosswordPuzzle,
  row: number,
  col: number,
  currentDirection: Direction,
  prevSelectedCell: CellPosition | null,
): Direction {
  const acrossEntry = getActiveEntry(puzzle, row, col, 'across');
  const downEntry = getActiveEntry(puzzle, row, col, 'down');

  // If only one direction is valid, use it
  if (acrossEntry && !downEntry) return 'across';
  if (!acrossEntry && downEntry) return 'down';
  if (!acrossEntry && !downEntry) return currentDirection;

  // If clicking the same cell again, toggle
  if (prevSelectedCell?.row === row && prevSelectedCell?.col === col) {
    return currentDirection === 'across' ? 'down' : 'across';
  }

  // Otherwise keep the current direction if valid
  return currentDirection;
}
