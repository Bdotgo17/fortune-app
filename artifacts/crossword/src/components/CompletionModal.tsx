import React from 'react';
import { useCrossword } from '../context/CrosswordContext';
import { formatTime } from '../lib/engine';

export function CompletionModal() {
  const { state } = useCrossword();
  const { isComplete, timer } = state;

  if (!isComplete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100 animate-in zoom-in-95 duration-300">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Puzzle Complete!</h2>
        <p className="text-gray-500 text-sm mb-6">
          You solved today's crossword
        </p>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">
            Your Time
          </div>
          <div className="text-4xl font-mono font-black tabular-nums text-blue-700">
            {formatTime(timer)}
          </div>
        </div>

        <p className="text-gray-400 text-xs">
          Come back tomorrow for a new puzzle!
        </p>
      </div>
    </div>
  );
}
