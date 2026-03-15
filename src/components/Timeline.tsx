import React, { useRef, useEffect, useState } from 'react';
import { usePromptStore, Footage } from '../store/usePromptStore';
import { Reorder, motion } from 'framer-motion';
import { Plus, GripVertical, Trash2, Clock, Play, Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function Timeline() {
  const { footages, selectedFootageId, selectFootage, addFootage, removeFootage, updateFootageDuration, reorderFootages } = usePromptStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-300">
          <Clock className="w-4 h-4 text-indigo-400" />
          Motion Timeline
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={addFootage}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Footage
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto overflow-y-hidden no-scrollbar">
        <div className="min-w-max h-full relative">
          {/* Timeline Grid Background */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px)', backgroundSize: '40px 100%' }}></div>
          
          {/* Time Markers */}
          <div className="absolute top-0 left-0 right-0 h-6 border-b border-slate-800 flex items-center text-[10px] text-slate-500 font-mono px-2">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="w-10 shrink-0 border-l border-slate-800 pl-1 h-full flex items-center">
                0:{i.toString().padStart(2, '0')}
              </div>
            ))}
          </div>

          {/* Footages Track */}
          <div className="absolute top-8 bottom-2 left-0 flex items-center px-2 gap-1">
            <Reorder.Group
              axis="x"
              values={footages}
              onReorder={reorderFootages}
              className="flex h-full items-center gap-1"
            >
            {footages.map((footage, index) => (
              <TimelineItem
                key={footage.id}
                footage={footage}
                index={index}
                isSelected={selectedFootageId === footage.id || (!selectedFootageId && index === 0)}
                onSelect={() => selectFootage(footage.id)}
                onRemove={() => removeFootage(footage.id)}
                onResize={(duration) => updateFootageDuration(footage.id, duration)}
              />
            ))}
          </Reorder.Group>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  footage,
  index,
  isSelected,
  onSelect,
  onRemove,
  onResize
}: {
  key?: string;
  footage: Footage;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onResize: (duration: number) => void;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(footage.duration);

  // 1 second = 40px width (to match the background grid)
  const pixelsPerSecond = 40;

  useEffect(() => {
    setCurrentDuration(footage.duration);
  }, [footage.duration]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startDuration = currentDuration;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaSeconds = deltaX / pixelsPerSecond;
      let newDuration = startDuration + deltaSeconds;
      
      // Snap to 0.5s increments
      newDuration = Math.round(newDuration * 2) / 2;
      
      if (newDuration < 2) newDuration = 2;
      if (newDuration > 10) newDuration = 10;
      
      setCurrentDuration(newDuration);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (!isResizing && currentDuration !== footage.duration) {
      onResize(currentDuration);
    }
  }, [isResizing, currentDuration, footage.duration, onResize]);

  return (
    <Reorder.Item
      value={footage}
      dragListener={!isResizing}
      className="relative h-full shrink-0"
    >
      <div
        ref={itemRef}
        onClick={onSelect}
        style={{ width: currentDuration * pixelsPerSecond }}
        className={cn(
          "h-full rounded-lg border flex flex-col justify-between p-2 transition-colors cursor-pointer group select-none overflow-hidden",
          isSelected
            ? "bg-indigo-600/20 border-indigo-500"
            : "bg-slate-800/80 border-slate-700 hover:border-slate-600"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-slate-300 truncate">Shot {index + 1}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400 transition-all z-10"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <GripVertical className="w-3 h-3 text-slate-500 opacity-50 group-hover:opacity-100 cursor-grab active:cursor-grabbing" />
          <span className="text-xs font-bold text-slate-200">{currentDuration}s</span>
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={handleResizeStart}
          className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize flex items-center justify-center group/handle z-10 hover:bg-indigo-500/20"
        >
          <div className="w-1 h-1/3 bg-slate-500 rounded-full group-hover/handle:bg-indigo-400 transition-colors" />
        </div>
      </div>
    </Reorder.Item>
  );
}
