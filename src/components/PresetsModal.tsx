import React from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { X, Film, MonitorPlay, Smartphone } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const PRESETS = [
  {
    id: 'p1',
    name: 'Cinematic Trailer',
    icon: <Film className="w-5 h-5 text-purple-400" />,
    description: 'Wide aspect ratio, dramatic lighting, slow camera movements.',
    blocks: [
      { type: 'camera', content: 'wide cinematic shot', category: 'Camera Presets' },
      { type: 'lighting', content: 'cinematic lighting', category: 'Lighting Engine' },
      { type: 'movement', content: 'slow rhythmic movement', category: 'Rhythm & Tempo' },
      { type: 'mood', content: 'high energy and dynamic', category: 'Mood Selector' },
    ]
  },
  {
    id: 'p2',
    name: 'Social Media Reel',
    icon: <Smartphone className="w-5 h-5 text-emerald-400" />,
    description: 'Vertical format, fast-paced, high energy.',
    blocks: [
      { type: 'camera', content: 'close-up', category: 'Camera Presets' },
      { type: 'lighting', content: 'neon lighting', category: 'Lighting Engine' },
      { type: 'movement', content: 'consistent tempo', category: 'Rhythm & Tempo' },
      { type: 'mood', content: 'high energy and dynamic', category: 'Mood Selector' },
    ]
  },
  {
    id: 'p3',
    name: 'Documentary Interview',
    icon: <MonitorPlay className="w-5 h-5 text-blue-400" />,
    description: 'Locked camera, soft lighting, natural feel.',
    blocks: [
      { type: 'camera', content: 'locked camera', category: 'Camera Presets' },
      { type: 'lighting', content: 'soft lighting', category: 'Lighting Engine' },
      { type: 'movement', content: 'natural breathing', category: 'Organic Motion' },
      { type: 'mood', content: 'natural interaction', category: 'Mood Selector' },
    ]
  }
] as const;

export function PresetsModal({ onClose }: { onClose: () => void }) {
  const { setBlocks } = usePromptStore();

  const applyPreset = (presetBlocks: readonly any[]) => {
    const newBlocks = presetBlocks.map(b => ({ ...b, id: uuidv4() }));
    setBlocks(newBlocks);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-400" />
            WAN Video Presets
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.blocks)}
              className="flex flex-col text-left p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500/50 hover:bg-slate-900 transition-all group"
            >
              <div className="mb-3 p-2 bg-slate-900 rounded-lg w-fit group-hover:scale-110 transition-transform">
                {preset.icon}
              </div>
              <h3 className="font-medium text-slate-200 mb-1">{preset.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{preset.description}</p>
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
