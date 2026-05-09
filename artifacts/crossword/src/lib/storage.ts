import type { CellState } from './types';

interface SavedProgress {
  puzzleId: string;
  puzzleDate: string;
  userGrid: CellState[][];
  timer: number;
  isComplete: boolean;
}

function getStorageKey(puzzleDate: string): string {
  return `crossword_progress_${puzzleDate}`;
}

export function saveProgress(data: SavedProgress): void {
  try {
    localStorage.setItem(getStorageKey(data.puzzleDate), JSON.stringify(data));
  } catch {
    // ignore storage errors (e.g. private browsing)
  }
}

export function loadProgress(puzzleDate: string): SavedProgress | null {
  try {
    const raw = localStorage.getItem(getStorageKey(puzzleDate));
    if (!raw) return null;
    return JSON.parse(raw) as SavedProgress;
  } catch {
    return null;
  }
}

export function clearProgress(puzzleDate: string): void {
  try {
    localStorage.removeItem(getStorageKey(puzzleDate));
  } catch {
    // ignore
  }
}
