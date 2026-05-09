export type Direction = 'across' | 'down';

export interface CellPosition {
  row: number;
  col: number;
}

export interface CrosswordEntry {
  number: number;
  direction: Direction;
  clue: string;
  answer: string;
  row: number;
  col: number;
  length: number;
}

export interface CrosswordPuzzle {
  id: string;
  title: string;
  size: number;
  // null = black cell, string = correct letter for that cell
  grid: (string | null)[][];
  entries: CrosswordEntry[];
}

export interface CellState {
  letter: string | null;
  isChecked: boolean;
  isIncorrect: boolean;
  isRevealed: boolean;
}

export interface CrosswordState {
  puzzle: CrosswordPuzzle;
  userGrid: CellState[][];
  selectedCell: CellPosition | null;
  direction: Direction;
  timer: number;
  timerActive: boolean;
  isComplete: boolean;
  puzzleDate: string;
}
