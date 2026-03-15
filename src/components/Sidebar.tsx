import React from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { PRELOADED_LIBRARY, BlockType, BLOCK_COLORS } from '../lib/constants';
import { Plus, X, Search, Sparkles, Save } from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar({ onClose }: { onClose: () => void }) {
  const { addBlock, customLibrary, addToCustomLibrary, removeFromCustomLibrary } = usePromptStore();
  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'library' | 'custom'>('library');
  const [newCustom, setNewCustom] = React.useState('');

  const filteredLibrary = Object.entries(PRELOADED_LIBRARY).reduce((acc, [category, items]) => {
    const filtered = items.filter(item => item.content.toLowerCase().includes(search.toLowerCase()));
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof PRELOADED_LIBRARY[string]>);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustom.trim()) return;
    addToCustomLibrary({
      content: newCustom,
      type: 'custom',
      category: 'Custom',
    });
    setNewCustom('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Motion Library
        </h2>
        <button onClick={onClose} className="lg:hidden p-1 hover:bg-slate-800 rounded-md">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 border-b border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search phrases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex border-b border-slate-800">
        <button
          className={cn("flex-1 py-3 text-sm font-medium transition-colors", activeTab === 'library' ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-400 hover:text-slate-200")}
          onClick={() => setActiveTab('library')}
        >
          Preloaded
        </button>
        <button
          className={cn("flex-1 py-3 text-sm font-medium transition-colors", activeTab === 'custom' ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-400 hover:text-slate-200")}
          onClick={() => setActiveTab('custom')}
        >
          Custom
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'library' ? (
          Object.entries(filteredLibrary).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{category}</h3>
              <div className="grid gap-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addBlock({ content: item.content, type: item.type, category: item.category })}
                    className={cn(
                      "text-left px-3 py-2 rounded-md text-sm transition-all hover:scale-[1.02] active:scale-[0.98] border",
                      BLOCK_COLORS[item.type]
                    )}
                  >
                    {item.content}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleAddCustom} className="flex gap-2">
              <input
                type="text"
                value={newCustom}
                onChange={(e) => setNewCustom(e.target.value)}
                placeholder="New custom phrase..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </form>
            <div className="grid gap-2">
              {customLibrary.map((item) => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <button
                    onClick={() => addBlock({ content: item.content, type: item.type, category: item.category })}
                    className={cn(
                      "flex-1 text-left px-3 py-2 rounded-md text-sm transition-all hover:scale-[1.02] active:scale-[0.98] border",
                      BLOCK_COLORS.custom
                    )}
                  >
                    {item.content}
                  </button>
                  <button
                    onClick={() => removeFromCustomLibrary(item.id)}
                    className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {customLibrary.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-8">No custom phrases yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
