import React, { useCallback, useEffect, useRef } from 'react';
import { useCrossword } from '../context/CrosswordContext';
import {
  computeCellNumbers,
  getActiveEntry,
  getEntryCells,
  getCellKey,
} from '../lib/engine';

function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function CrosswordGrid() {
  const { state, dispatch } = useCrossword();
  const { puzzle, userGrid, selectedCell, direction } = state;
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const cellNumbers = computeCellNumbers(puzzle);

  // Find cells in the active word for highlighting
  const activeEntryCells = new Set<string>();
  if (selectedCell) {
    const entry = getActiveEntry(puzzle, selectedCell.row, selectedCell.col, direction);
    if (entry) {
      for (const c of getEntryCells(entry)) {
        activeEntryCells.add(getCellKey(c.row, c.col));
      }
    }
  }

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (puzzle.grid[row][col] === null) return;
      dispatch({ type: 'SELECT_CELL', row, col });
      hiddenInputRef.current?.focus();
    },
    [puzzle, dispatch],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const key = e.key;

      if (key === 'Backspace' || key === 'Delete') {
        e.preventDefault();
        dispatch({ type: 'BACKSPACE' });
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        e.preventDefault();
        dispatch({
          type: 'NAVIGATE',
          arrow: key as 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight',
        });
        return;
      }

      if (key === 'Tab') {
        e.preventDefault();
        return;
      }

      if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
        e.preventDefault();
        dispatch({ type: 'TYPE_LETTER', letter: key });
      }
    },
    [dispatch],
  );

  // Handle input from virtual keyboard (mobile): onChange fires for each letter inserted
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.length > 0) {
        const last = value[value.length - 1];
        if (/^[a-zA-Z]$/.test(last)) {
          dispatch({ type: 'TYPE_LETTER', letter: last });
        }
        // Clear the input so every subsequent keystroke fires a fresh onChange
        e.target.value = '';
      }
    },
    [dispatch],
  );

  // Handle virtual keyboard delete/backspace via beforeinput event (more reliable on mobile)
  const handleBeforeInput = useCallback(
    (e: React.FormEvent<HTMLInputElement> & { inputType?: string }) => {
      if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
        e.preventDefault();
        dispatch({ type: 'BACKSPACE' });
      }
    },
    [dispatch],
  );

  // Focus hidden input when a cell is selected
  useEffect(() => {
    if (selectedCell) {
      hiddenInputRef.current?.focus();
    }
  }, [selectedCell]);

  const getCellStyle = (
    row: number,
    col: number,
    isBlack: boolean,
    isSelected: boolean,
    isActiveWord: boolean,
    isIncorrect: boolean,
    isRevealed: boolean,
  ): string => {
    if (isBlack) {
      return 'bg-gray-900';
    }
    if (isSelected) {
      return 'bg-blue-500 text-white';
    }
    if (isIncorrect) {
      return 'bg-red-100 text-red-800';
    }
    if (isActiveWord) {
      return 'bg-blue-100';
    }
    if (isRevealed) {
      return 'bg-amber-50';
    }
    return 'bg-white';
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hidden input captures both hardware keyboard (onKeyDown) and virtual keyboard (onChange) */}
      <input
        ref={hiddenInputRef}
        className="sr-only"
        aria-hidden="true"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        onBeforeInput={handleBeforeInput}
      />

      <div
        ref={containerRef}
        className="inline-block border-2 border-gray-900 focus:outline-none"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${puzzle.size}, 1fr)`,
          gap: '1.5px',
          backgroundColor: '#1a1a1a',
          padding: '1.5px',
        }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="grid"
        aria-label="Crossword grid"
      >
        {puzzle.grid.map((rowCells, rowIdx) =>
          rowCells.map((correctLetter, colIdx) => {
            const isBlack = correctLetter === null;
            const key = getCellKey(rowIdx, colIdx);
            const isSelected =
              selectedCell?.row === rowIdx && selectedCell?.col === colIdx;
            const isActiveWord = activeEntryCells.has(key);
            const cellState = userGrid[rowIdx][colIdx];
            const isIncorrect = cellState.isChecked && cellState.isIncorrect;
            const isRevealed = cellState.isRevealed && correctLetter !== null;
            const displayNumber = cellNumbers.get(key);

            const bgClass = getCellStyle(
              rowIdx,
              colIdx,
              isBlack,
              isSelected,
              isActiveWord,
              isIncorrect,
              isRevealed,
            );

            return (
              <div
                key={key}
                className={classNames(
                  'relative flex items-center justify-center select-none',
                  bgClass,
                  !isBlack && 'cursor-pointer',
                )}
                style={{
                  width: 'clamp(40px, 10vw, 56px)',
                  height: 'clamp(40px, 10vw, 56px)',
                }}
                onClick={() => handleCellClick(rowIdx, colIdx)}
                role="gridcell"
                aria-selected={isSelected}
              >
                {!isBlack && (
                  <>
                    {displayNumber !== undefined && (
                      <span
                        className={classNames(
                          'absolute top-0 left-0.5 text-xs font-semibold leading-none pt-0.5',
                          isSelected ? 'text-white' : 'text-gray-600',
                        )}
                        style={{ fontSize: 'clamp(8px, 1.5vw, 11px)' }}
                      >
                        {displayNumber}
                      </span>
                    )}
                    <span
                      className={classNames(
                        'font-bold uppercase select-none leading-none',
                        isSelected ? 'text-white' : isIncorrect ? 'text-red-700' : 'text-gray-900',
                        isRevealed && !isSelected && 'text-amber-700',
                      )}
                      style={{ fontSize: 'clamp(16px, 4vw, 26px)' }}
                    >
                      {cellState.letter ?? ''}
                    </span>
                    {isRevealed && !isSelected && (
                      <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    )}
                  </>
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
