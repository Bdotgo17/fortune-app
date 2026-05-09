import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import type { CrosswordPuzzle, CrosswordState, CellState, Direction } from '../lib/types';
import {
  checkCompletion,
  checkIncorrectCells,
  formatDate,
  getActiveEntry,
  getEntryCells,
  getNextCellInEntry,
  getPrevCellInEntry,
  navigateArrow,
  preferredDirection,
} from '../lib/engine';
import type { CrosswordEntry } from '../lib/types';
import { getPuzzleForDate } from '../lib/puzzles';
import { loadProgress, saveProgress } from '../lib/storage';

type Action =
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'SET_DIRECTION'; direction: Direction }
  | { type: 'TYPE_LETTER'; letter: string }
  | { type: 'BACKSPACE' }
  | { type: 'NAVIGATE'; arrow: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' }
  | { type: 'CHECK_WORD' }
  | { type: 'CHECK_PUZZLE' }
  | { type: 'REVEAL_WORD' }
  | { type: 'REVEAL_PUZZLE' }
  | { type: 'TICK' }
  | { type: 'LOAD_SAVED'; userGrid: CellState[][]; timer: number; isComplete: boolean };

function makeEmptyGrid(puzzle: CrosswordPuzzle): CellState[][] {
  return Array.from({ length: puzzle.size }, (_, r) =>
    Array.from({ length: puzzle.size }, (_, c) => ({
      letter: null,
      isChecked: false,
      isIncorrect: false,
      isRevealed: puzzle.grid[r][c] === null, // black cells treated as revealed (irrelevant)
    })),
  );
}

function cloneGrid(grid: CellState[][]): CellState[][] {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

function reducer(state: CrosswordState, action: Action): CrosswordState {
  const { puzzle, userGrid, selectedCell, direction } = state;

  switch (action.type) {
    case 'SELECT_CELL': {
      const { row, col } = action;
      if (puzzle.grid[row][col] === null) return state;
      const newDir = preferredDirection(puzzle, row, col, direction, selectedCell);
      return { ...state, selectedCell: { row, col }, direction: newDir };
    }

    case 'SET_DIRECTION': {
      return { ...state, direction: action.direction };
    }

    case 'TYPE_LETTER': {
      if (!selectedCell) return state;
      const { row, col } = selectedCell;
      if (puzzle.grid[row][col] === null) return state;

      const letter = action.letter.toUpperCase();
      const newGrid = cloneGrid(userGrid);
      newGrid[row][col] = {
        ...newGrid[row][col],
        letter,
        isChecked: false,
        isIncorrect: false,
      };

      // Move to next cell in the current word
      const next = getNextCellInEntry(puzzle, row, col, direction);
      const newSelected = next || selectedCell;

      const isComplete = checkCompletion(puzzle, newGrid);

      return {
        ...state,
        userGrid: newGrid,
        selectedCell: newSelected,
        timerActive: !isComplete,
        isComplete,
      };
    }

    case 'BACKSPACE': {
      if (!selectedCell) return state;
      const { row, col } = selectedCell;
      const newGrid = cloneGrid(userGrid);
      const currentCell = newGrid[row][col];

      if (currentCell.letter) {
        // Clear current cell
        newGrid[row][col] = {
          ...currentCell,
          letter: null,
          isChecked: false,
          isIncorrect: false,
        };
        return { ...state, userGrid: newGrid };
      } else {
        // Move back and clear previous cell
        const prev = getPrevCellInEntry(puzzle, row, col, direction);
        if (prev) {
          newGrid[prev.row][prev.col] = {
            ...newGrid[prev.row][prev.col],
            letter: null,
            isChecked: false,
            isIncorrect: false,
          };
          return { ...state, userGrid: newGrid, selectedCell: prev };
        }
        return state;
      }
    }

    case 'NAVIGATE': {
      if (!selectedCell) return state;
      const { row, col } = selectedCell;
      const arrowDir = action.arrow;

      // If arrow matches current direction, move within word
      const isHorizontal = arrowDir === 'ArrowLeft' || arrowDir === 'ArrowRight';
      const isVertical = arrowDir === 'ArrowUp' || arrowDir === 'ArrowDown';
      const matchesDir =
        (direction === 'across' && isHorizontal) ||
        (direction === 'down' && isVertical);

      if (!matchesDir) {
        // Toggle direction to match arrow
        const newDir: Direction = isHorizontal ? 'across' : 'down';
        const entry = getActiveEntry(puzzle, row, col, newDir);
        if (entry) return { ...state, direction: newDir };
        return state;
      }

      const next = navigateArrow(puzzle, row, col, arrowDir);
      if (!next) return state;
      return { ...state, selectedCell: next };
    }

    case 'CHECK_WORD': {
      if (!selectedCell) return state;
      const entry = getActiveEntry(puzzle, selectedCell.row, selectedCell.col, direction);
      if (!entry) return state;

      const cells = getEntryCells(entry);
      const newGrid = cloneGrid(userGrid);
      for (const { row, col } of cells) {
        const cell = newGrid[row][col];
        if (cell.letter) {
          const correct = puzzle.grid[row][col];
          newGrid[row][col] = {
            ...cell,
            isChecked: true,
            isIncorrect: cell.letter.toUpperCase() !== (correct?.toUpperCase() ?? ''),
          };
        }
      }
      return { ...state, userGrid: newGrid };
    }

    case 'CHECK_PUZZLE': {
      const newGrid = cloneGrid(userGrid);
      const incorrectKeys = checkIncorrectCells(puzzle, userGrid);
      for (let r = 0; r < puzzle.size; r++) {
        for (let c = 0; c < puzzle.size; c++) {
          if (puzzle.grid[r][c] === null) continue;
          const cell = newGrid[r][c];
          if (cell.letter) {
            const key = `${r},${c}`;
            newGrid[r][c] = {
              ...cell,
              isChecked: true,
              isIncorrect: incorrectKeys.has(key),
            };
          }
        }
      }
      return { ...state, userGrid: newGrid };
    }

    case 'REVEAL_WORD': {
      if (!selectedCell) return state;
      const entry = getActiveEntry(puzzle, selectedCell.row, selectedCell.col, direction);
      if (!entry) return state;

      const cells = getEntryCells(entry);
      const newGrid = cloneGrid(userGrid);
      for (const { row, col } of cells) {
        const correct = puzzle.grid[row][col];
        if (correct !== null) {
          newGrid[row][col] = {
            letter: correct,
            isChecked: false,
            isIncorrect: false,
            isRevealed: true,
          };
        }
      }
      const isComplete = checkCompletion(puzzle, newGrid);
      return { ...state, userGrid: newGrid, isComplete, timerActive: !isComplete };
    }

    case 'REVEAL_PUZZLE': {
      const newGrid = cloneGrid(userGrid);
      for (let r = 0; r < puzzle.size; r++) {
        for (let c = 0; c < puzzle.size; c++) {
          const correct = puzzle.grid[r][c];
          if (correct !== null) {
            newGrid[r][c] = {
              letter: correct,
              isChecked: false,
              isIncorrect: false,
              isRevealed: true,
            };
          }
        }
      }
      return { ...state, userGrid: newGrid, isComplete: true, timerActive: false };
    }

    case 'TICK': {
      if (!state.timerActive) return state;
      return { ...state, timer: state.timer + 1 };
    }

    case 'LOAD_SAVED': {
      return {
        ...state,
        userGrid: action.userGrid,
        timer: action.timer,
        isComplete: action.isComplete,
        timerActive: false,
      };
    }

    default:
      return state;
  }
}

interface CrosswordContextValue {
  state: CrosswordState;
  dispatch: React.Dispatch<Action>;
}

const CrosswordContext = createContext<CrosswordContextValue | null>(null);

export function CrosswordProvider({ children }: { children: React.ReactNode }) {
  const today = formatDate(new Date());
  const puzzle = getPuzzleForDate(today);

  const initialState: CrosswordState = {
    puzzle,
    userGrid: makeEmptyGrid(puzzle),
    selectedCell: null,
    direction: 'across',
    timer: 0,
    timerActive: false,
    isComplete: false,
    puzzleDate: today,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const saved = loadProgress(today);
    if (saved && saved.puzzleId === puzzle.id) {
      dispatch({
        type: 'LOAD_SAVED',
        userGrid: saved.userGrid,
        timer: saved.timer,
        isComplete: saved.isComplete,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist to localStorage whenever userGrid or timer changes
  const saveRef = useRef(saveProgress);
  saveRef.current = saveProgress;

  useEffect(() => {
    saveRef.current({
      puzzleId: puzzle.id,
      puzzleDate: today,
      userGrid: state.userGrid,
      timer: state.timer,
      isComplete: state.isComplete,
    });
  }, [state.userGrid, state.timer, state.isComplete, puzzle.id, today]);

  // Timer tick
  useEffect(() => {
    if (!state.timerActive) return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(id);
  }, [state.timerActive]);

  return (
    <CrosswordContext.Provider value={{ state, dispatch }}>
      {children}
    </CrosswordContext.Provider>
  );
}

export function useCrossword(): CrosswordContextValue {
  const ctx = useContext(CrosswordContext);
  if (!ctx) throw new Error('useCrossword must be used inside CrosswordProvider');
  return ctx;
}

export type { Action };
