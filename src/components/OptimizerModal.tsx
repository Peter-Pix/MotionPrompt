import React from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { X, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

export function OptimizerModal({ onClose }: { onClose: () => void }) {
  const { footages } = usePromptStore();
  const allBlocks = footages.flatMap(f => [...f.sceneBlocks, ...f.subjectBlocks]);
  const promptText = allBlocks.map(b => b.content).join(', ');
  
  // Simple heuristics for demonstration
  const tokenCount = Math.ceil(promptText.split(/\s+/).length * 1.3);
  const hasCamera = allBlocks.some(b => b.type === 'camera');
  const hasLighting = allBlocks.some(b => b.type === 'lighting');
  const hasMovement = allBlocks.some(b => b.type === 'movement');
  
  const suggestions = [];
  if (!hasCamera) suggestions.push("Consider adding a camera instruction for better framing.");
  if (!hasLighting) suggestions.push("Lighting instructions help define the mood. Try adding one.");
  if (!hasMovement) suggestions.push("This is a motion prompt, but no movement is specified!");
  if (tokenCount > 75) suggestions.push("Prompt is getting long. Consider simplifying for better AI adherence.");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Prompt Optimizer
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-sm text-slate-400 mb-1">Est. Tokens</div>
              <div className="text-2xl font-semibold text-slate-200">{tokenCount}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-sm text-slate-400 mb-1">Block Count</div>
              <div className="text-2xl font-semibold text-slate-200">{allBlocks.length}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Analysis & Suggestions</h3>
            {suggestions.length === 0 ? (
              <div className="flex items-start gap-3 text-emerald-400 bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">Your prompt looks great! It has a good balance of instructions.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {suggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-3 text-yellow-400 bg-yellow-400/10 p-3 rounded-lg border border-yellow-400/20">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
