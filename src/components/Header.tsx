import React, { useState } from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { Menu, Wand2, Download, Copy, Settings, RotateCcw, RotateCw, Trash2, Zap, Film } from 'lucide-react';
import { cn } from '../lib/utils';
import { OptimizerModal } from './OptimizerModal';
import { PresetsModal } from './PresetsModal';
import { ExportModal } from './ExportModal';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { footages, generateRandomPrompt, undo, redo, clearBlocks, historyIndex, history } = usePromptStore();
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleCopy = () => {
    const promptText = footages.map(f => {
      const scene = f.sceneBlocks.map(b => b.content).join(', ');
      const subject = f.subjectBlocks.map(b => b.content).join(', ');
      return [scene, subject].filter(Boolean).join(', ');
    }).join('\n');
    navigator.clipboard.writeText(promptText);
    // Could add a toast here
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hidden sm:block">
            MotionPrompt
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
          <button
            onClick={undo}
            disabled={historyIndex === 0}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            title="Redo"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-800 mx-1" />
          <button
            onClick={clearBlocks}
            disabled={footages.every(f => f.sceneBlocks.length === 0 && f.subjectBlocks.length === 0)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            title="Clear All"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setIsPresetsOpen(true)}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors border border-slate-700"
        >
          <Film className="w-4 h-4 text-indigo-400" />
          Presets
        </button>

        <button
          onClick={() => setIsOptimizerOpen(true)}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors border border-slate-700"
        >
          <Zap className="w-4 h-4 text-yellow-400" />
          Optimize
        </button>

        <button
          onClick={generateRandomPrompt}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors border border-slate-700"
        >
          <Wand2 className="w-4 h-4" />
          Randomize
        </button>

        <button
          onClick={handleCopy}
          disabled={footages.every(f => f.sceneBlocks.length === 0 && f.subjectBlocks.length === 0)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:shadow-none"
        >
          <Copy className="w-4 h-4" />
          <span className="hidden sm:inline">Copy</span>
        </button>

        <button
          onClick={() => setIsExportOpen(true)}
          disabled={footages.length === 0}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
          title="Export Options"
        >
          <Download className="w-5 h-5" />
        </button>

        <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700">
          <Settings className="w-5 h-5" />
        </button>
      </div>
      
      {isOptimizerOpen && <OptimizerModal onClose={() => setIsOptimizerOpen(false)} />}
      {isPresetsOpen && <PresetsModal onClose={() => setIsPresetsOpen(false)} />}
      {isExportOpen && <ExportModal onClose={() => setIsExportOpen(false)} />}
    </header>
  );
}
