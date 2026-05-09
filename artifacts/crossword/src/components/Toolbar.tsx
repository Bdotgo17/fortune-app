import React from 'react';
import { useCrossword } from '../context/CrosswordContext';
import { formatDateLong, formatTime } from '../lib/engine';

function ToolbarButton({
  onClick,
  variant = 'default',
  children,
}: {
  onClick: () => void;
  variant?: 'default' | 'danger';
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        variant === 'danger'
          ? 'px-3 py-1.5 text-xs font-semibold rounded border transition-colors bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
          : 'px-3 py-1.5 text-xs font-semibold rounded border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
      }
    >
      {children}
    </button>
  );
}

export function Toolbar() {
  const { state, dispatch } = useCrossword();
  const { puzzleDate, timer, timerActive, isComplete, puzzle } = state;

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 leading-none">
            Daily Crossword
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">{formatDateLong(puzzleDate)}</p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div className="text-2xl font-mono font-bold tabular-nums text-gray-800 leading-none">
            {formatTime(timer)}
          </div>
          <div className="text-xs text-gray-400">
            {isComplete ? '✓ Solved!' : timerActive ? 'running' : timer === 0 ? 'not started' : 'paused'}
          </div>
        </div>
      </div>

      {/* Puzzle title */}
      <div className="text-center mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {puzzle.title}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <ToolbarButton onClick={() => dispatch({ type: 'CHECK_WORD' })}>
          Check Word
        </ToolbarButton>
        <ToolbarButton onClick={() => dispatch({ type: 'CHECK_PUZZLE' })}>
          Check Puzzle
        </ToolbarButton>
        <ToolbarButton variant="danger" onClick={() => dispatch({ type: 'REVEAL_WORD' })}>
          Reveal Word
        </ToolbarButton>
        <ToolbarButton variant="danger" onClick={() => dispatch({ type: 'REVEAL_PUZZLE' })}>
          Reveal Puzzle
        </ToolbarButton>
      </div>
    </div>
  );
}
