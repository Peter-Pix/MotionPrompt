import React from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { Reorder, motion, AnimatePresence } from 'motion/react';
import { GripVertical, X, Copy, Edit2, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { BLOCK_COLORS } from '../lib/constants';

export function SceneBuilder() {
  const { footages, selectedFootageId, activeTab, setActiveTab, removeBlock, duplicateBlock, updateBlock, setBlocks } = usePromptStore();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const selectedFootage = footages.find(f => f.id === selectedFootageId) || footages[0];
  const blocks = activeTab === 'scene' ? selectedFootage.sceneBlocks : selectedFootage.subjectBlocks;

  const toggleSelection = (e: React.MouseEvent, id: string) => {
    if (e.ctrlKey || e.metaKey) {
      e.stopPropagation();
      const newSelected = new Set(selectedIds);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      setSelectedIds(newSelected);
    }
  };

  const copySelected = () => {
    if (selectedIds.size === 0) return;
    const selectedBlocks = blocks.filter(b => selectedIds.has(b.id));
    const text = selectedBlocks.map(b => b.content).join(', ');
    navigator.clipboard.writeText(text);
    setSelectedIds(new Set()); // Clear selection after copy
  };

  // Add keyboard listener for copy
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedIds.size > 0) {
        copySelected();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, blocks]);

  const startEditing = (id: string, content: string) => {
    setEditingId(id);
    setEditValue(content);
  };

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      updateBlock(id, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Scene Builder</h2>
          <p className="text-slate-400">Drag and drop blocks to compose your motion prompt. Click to edit. Ctrl/Cmd+Click to select.</p>
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
            <div className="w-px h-4 bg-indigo-500/20" />
            <button onClick={copySelected} className="text-sm hover:text-indigo-300 font-medium flex items-center gap-1">
              <Copy className="w-4 h-4" /> Copy
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="text-sm hover:text-indigo-300 font-medium flex items-center gap-1">
              <X className="w-4 h-4" /> Clear
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab('scene')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            activeTab === 'scene' ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          )}
        >
          Scene Prompt
        </button>
        <button
          onClick={() => setActiveTab('subject')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            activeTab === 'subject' ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          )}
        >
          Subject Prompt
        </button>
      </div>

      <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 min-h-[300px] overflow-y-auto relative no-scrollbar">
        {blocks.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
            <div className="w-16 h-16 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center mb-4">
              <GripVertical className="w-8 h-8 text-slate-600" />
            </div>
            <p>Drag blocks from the library or click to add them here.</p>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={blocks}
            onReorder={(newBlocks) => {
              setBlocks(newBlocks);
            }}
            className="space-y-3"
          >
            <AnimatePresence initial={false}>
              {blocks.map((block) => (
                <Reorder.Item
                  key={block.id}
                  value={block}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={(e) => toggleSelection(e, block.id)}
                  className={cn(
                    "group flex items-center gap-3 p-4 rounded-xl border bg-slate-950/80 backdrop-blur-sm shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing",
                    BLOCK_COLORS[block.type],
                    selectedIds.has(block.id) ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 scale-[1.02]" : ""
                  )}
                >
                  <GripVertical className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">
                      {block.type}
                    </div>
                    {editingId === block.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(block.id)}
                          autoFocus
                          className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                        <button onClick={() => saveEdit(block.id)} className="p-1 hover:bg-slate-800 rounded text-emerald-400">
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="text-sm font-medium cursor-text leading-relaxed"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(block.id, block.content);
                        }}
                      >
                        {block.content.split(/({[^}]+})/).map((part, i) => 
                          part.startsWith('{') && part.endsWith('}') ? (
                            <span key={i} className="text-indigo-300 bg-indigo-500/20 px-1 rounded mx-0.5 font-mono text-xs border border-indigo-500/30">
                              {part}
                            </span>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => startEditing(block.id, block.content)}
                      className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => duplicateBlock(block.id)}
                      className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeBlock(block.id)}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </div>

      {/* Output Preview */}
      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Shot {footages.findIndex(f => f.id === selectedFootage.id) + 1} Preview</div>
        <p className="text-sm text-slate-300 leading-relaxed font-mono">
          {(selectedFootage.sceneBlocks.length > 0 || selectedFootage.subjectBlocks.length > 0) ? (
            [...selectedFootage.sceneBlocks, ...selectedFootage.subjectBlocks].map(b => b.content).join(', ').split(/({[^}]+})/).map((part, i) => 
              part.startsWith('{') && part.endsWith('}') ? (
                <span key={i} className="text-indigo-300 bg-indigo-500/20 px-1 rounded mx-0.5 font-mono text-xs border border-indigo-500/30">
                  {part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )
          ) : (
            <span className="text-slate-600 italic">Your prompt will appear here...</span>
          )}
        </p>
      </div>
    </div>
  );
}
