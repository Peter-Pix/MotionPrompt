export type BlockType = 'character' | 'camera' | 'movement' | 'environment' | 'lighting' | 'mood' | 'custom';

export interface PromptBlock {
  id: string;
  type: BlockType;
  content: string;
  category?: string;
}

export const PRELOADED_LIBRARY: Record<string, PromptBlock[]> = {
  'Rhythm & Tempo': [
    { id: 'rt1', type: 'movement', content: 'slow rhythmic movement', category: 'Rhythm & Tempo' },
    { id: 'rt2', type: 'movement', content: 'consistent tempo', category: 'Rhythm & Tempo' },
    { id: 'rt3', type: 'movement', content: 'repeating motion loop', category: 'Rhythm & Tempo' },
  ],
  'Scale & Control': [
    { id: 'sc1', type: 'movement', content: 'small controlled movements', category: 'Scale & Control' },
    { id: 'sc2', type: 'movement', content: 'gentle weight shifting', category: 'Scale & Control' },
    { id: 'sc3', type: 'movement', content: 'subtle body sway', category: 'Scale & Control' },
  ],
  'Organic Motion': [
    { id: 'om1', type: 'movement', content: 'natural breathing', category: 'Organic Motion' },
    { id: 'om2', type: 'movement', content: 'hips shifting slightly', category: 'Organic Motion' },
    { id: 'om3', type: 'movement', content: 'breathing synchronized', category: 'Organic Motion' },
  ],
  'Camera Presets': [
    { id: 'cp1', type: 'camera', content: 'locked camera at {angle}', category: 'Camera Presets' },
    { id: 'cp2', type: 'camera', content: 'tripod shot with {lens_mm}mm lens', category: 'Camera Presets' },
    { id: 'cp3', type: 'camera', content: 'close-up on {subject}', category: 'Camera Presets' },
    { id: 'cp4', type: 'camera', content: 'wide cinematic shot', category: 'Camera Presets' },
    { id: 'cp5', type: 'camera', content: 'smooth tracking shot following {subject}', category: 'Camera Presets' },
    { id: 'cp6', type: 'camera', content: 'dynamic drone shot over {location}', category: 'Camera Presets' },
  ],
  'Lighting Engine': [
    { id: 'le1', type: 'lighting', content: 'cinematic lighting', category: 'Lighting Engine' },
    { id: 'le2', type: 'lighting', content: 'soft lighting', category: 'Lighting Engine' },
    { id: 'le3', type: 'lighting', content: 'neon lighting', category: 'Lighting Engine' },
    { id: 'le4', type: 'lighting', content: 'golden hour lighting', category: 'Lighting Engine' },
    { id: 'le5', type: 'lighting', content: 'harsh directional light', category: 'Lighting Engine' },
  ],
  'Environment Builder': [
    { id: 'eb1', type: 'environment', content: 'luxury interior', category: 'Environment Builder' },
    { id: 'eb2', type: 'environment', content: 'night scene', category: 'Environment Builder' },
    { id: 'eb3', type: 'environment', content: 'minimalist background', category: 'Environment Builder' },
    { id: 'eb4', type: 'environment', content: 'cyberpunk city street', category: 'Environment Builder' },
    { id: 'eb5', type: 'environment', content: 'misty forest', category: 'Environment Builder' },
  ],
  'Mood Selector': [
    { id: 'ms1', type: 'mood', content: 'relaxed atmosphere', category: 'Mood Selector' },
    { id: 'ms2', type: 'mood', content: 'intimate moment', category: 'Mood Selector' },
    { id: 'ms3', type: 'mood', content: 'natural interaction', category: 'Mood Selector' },
    { id: 'ms4', type: 'mood', content: 'high energy and dynamic', category: 'Mood Selector' },
    { id: 'ms5', type: 'mood', content: 'melancholic and moody', category: 'Mood Selector' },
  ]
};

export const BLOCK_COLORS: Record<BlockType, string> = {
  character: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  camera: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  movement: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  environment: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  lighting: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  mood: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  custom: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
};
