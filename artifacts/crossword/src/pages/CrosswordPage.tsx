import React from 'react';
import { CrosswordGrid } from '../components/CrosswordGrid';
import { CluesPanel } from '../components/CluesPanel';
import { Toolbar } from '../components/Toolbar';
import { CompletionModal } from '../components/CompletionModal';
import { CrosswordProvider } from '../context/CrosswordContext';

function CrosswordGame() {
  return (
    <div className="min-h-screen bg-stone-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Toolbar / Header */}
        <div className="mb-6">
          <Toolbar />
        </div>

        {/* Divider */}
        <div className="border-t-2 border-gray-900 mb-6" />

        {/* Grid centered */}
        <div className="flex justify-center mb-8">
          <CrosswordGrid />
        </div>

        {/* Clues panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <CluesPanel />
        </div>

        {/* Instructions */}
        <p className="text-xs text-gray-400 text-center mt-4">
          Click a cell to select it · Click again to toggle direction · Type to fill · Backspace to erase
        </p>
      </div>

      {/* Completion modal */}
      <CompletionModal />
    </div>
  );
}

export default function CrosswordPage() {
  return (
    <CrosswordProvider>
      <CrosswordGame />
    </CrosswordProvider>
  );
}
