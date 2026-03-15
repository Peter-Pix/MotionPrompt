import React, { useState } from 'react';
import { usePromptStore } from '../store/usePromptStore';
import { X, Download, Copy, FileText, FileJson, FileCode2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function ExportModal({ onClose }: { onClose: () => void }) {
  const { footages } = usePromptStore();
  const [format, setFormat] = useState<'text' | 'json' | 'markdown'>('text');
  const [copied, setCopied] = useState(false);

  const getFormattedContent = () => {
    if (format === 'json') {
      return JSON.stringify(footages, null, 2);
    }
    if (format === 'markdown') {
      return footages.map((f, i) => `### Shot ${i + 1} (${f.duration}s)\n**Scene:** ${f.sceneBlocks.map(b => b.content).join(', ')}\n**Subject:** ${f.subjectBlocks.map(b => b.content).join(', ')}`).join('\n\n');
    }
    return footages.map(f => {
      const scene = f.sceneBlocks.map(b => b.content).join(', ');
      const subject = f.subjectBlocks.map(b => b.content).join(', ');
      return [scene, subject].filter(Boolean).join(', ');
    }).join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFormattedContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = getFormattedContent();
    const mimeType = format === 'json' ? 'application/json' : 'text/plain';
    const extension = format === 'json' ? 'json' : format === 'markdown' ? 'md' : 'txt';
    
    const dataStr = `data:${mimeType};charset=utf-8,` + encodeURIComponent(content);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `motion_prompt.${extension}`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-400" />
            Export Prompt
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('text')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all",
                format === 'text' ? "bg-indigo-600/10 border-indigo-500 text-indigo-400" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              )}
            >
              <FileText className="w-4 h-4" />
              Plain Text
            </button>
            <button
              onClick={() => setFormat('markdown')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all",
                format === 'markdown' ? "bg-indigo-600/10 border-indigo-500 text-indigo-400" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              )}
            >
              <FileCode2 className="w-4 h-4" />
              Markdown
            </button>
            <button
              onClick={() => setFormat('json')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all",
                format === 'json' ? "bg-indigo-600/10 border-indigo-500 text-indigo-400" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              )}
            >
              <FileJson className="w-4 h-4" />
              JSON
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-2 min-h-[200px]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Preview</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <textarea
              readOnly
              value={getFormattedContent()}
              className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 font-mono resize-none focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors">
            Cancel
          </button>
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
            <Download className="w-4 h-4" />
            Download File
          </button>
        </div>
      </div>
    </div>
  );
}
