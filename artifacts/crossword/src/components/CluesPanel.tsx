import React, { useEffect, useRef } from 'react';
import { useCrossword } from '../context/CrosswordContext';
import { getActiveEntry } from '../lib/engine';
import type { CrosswordEntry } from '../lib/types';

function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

function ClueList({
  title,
  entries,
  activeEntry,
  onClueClick,
}: {
  title: string;
  entries: CrosswordEntry[];
  activeEntry: CrosswordEntry | undefined;
  onClueClick: (entry: CrosswordEntry) => void;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeEntry]);

  const sorted = [...entries].sort((a, b) => a.number - b.number);

  return (
    <div className="flex flex-col min-w-0">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 px-1">
        {title}
      </h3>
      <div className="space-y-0.5">
        {sorted.map((entry) => {
          const isActive =
            activeEntry?.number === entry.number &&
            activeEntry?.direction === entry.direction;

          return (
            <button
              key={`${entry.direction}-${entry.number}`}
              ref={isActive ? activeRef : undefined}
              className={classNames(
                'w-full text-left px-2 py-1.5 rounded text-sm leading-snug transition-colors',
                isActive
                  ? 'bg-blue-500 text-white font-medium'
                  : 'hover:bg-gray-100 text-gray-700',
              )}
              onClick={() => onClueClick(entry)}
            >
              <span
                className={classNames(
                  'font-bold mr-1.5',
                  isActive ? 'text-blue-100' : 'text-gray-500',
                )}
              >
                {entry.number}.
              </span>
              {entry.clue}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CluesPanel() {
  const { state, dispatch } = useCrossword();
  const { puzzle, selectedCell, direction } = state;

  const activeEntry = selectedCell
    ? getActiveEntry(puzzle, selectedCell.row, selectedCell.col, direction)
    : undefined;

  const acrossEntries = puzzle.entries.filter((e) => e.direction === 'across');
  const downEntries = puzzle.entries.filter((e) => e.direction === 'down');

  const handleClueClick = (entry: CrosswordEntry) => {
    // Select the first cell of the entry
    dispatch({ type: 'SELECT_CELL', row: entry.row, col: entry.col });
    dispatch({ type: 'SET_DIRECTION', direction: entry.direction });
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full">
      <ClueList
        title="Across"
        entries={acrossEntries}
        activeEntry={activeEntry?.direction === 'across' ? activeEntry : undefined}
        onClueClick={handleClueClick}
      />
      <ClueList
        title="Down"
        entries={downEntries}
        activeEntry={activeEntry?.direction === 'down' ? activeEntry : undefined}
        onClueClick={handleClueClick}
      />
    </div>
  );
}
