import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { PromptBlock, PRELOADED_LIBRARY, BlockType } from '../lib/constants';

export interface Footage {
  id: string;
  duration: number; // 2 to 10
  sceneBlocks: PromptBlock[];
  subjectBlocks: PromptBlock[];
}

interface AppState {
  footages: Footage[];
  selectedFootageId: string | null;
  activeTab: 'scene' | 'subject';
  customLibrary: PromptBlock[];
  
  isSidebarOpen: boolean;
  isTimelineOpen: boolean;
  toggleSidebar: () => void;
  toggleTimeline: () => void;

  // History tracks the footages array
  history: Footage[][];
  historyIndex: number;

  // Timeline actions
  addFootage: () => void;
  removeFootage: (id: string) => void;
  updateFootageDuration: (id: string, duration: number) => void;
  reorderFootages: (newOrder: Footage[]) => void;
  selectFootage: (id: string | null) => void;
  setActiveTab: (tab: 'scene' | 'subject') => void;

  // Block actions (apply to selected footage and active tab)
  addBlock: (block: Omit<PromptBlock, 'id'>) => void;
  updateBlock: (id: string, content: string) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  setBlocks: (blocks: PromptBlock[]) => void;
  clearBlocks: () => void;

  undo: () => void;
  redo: () => void;
  
  addToCustomLibrary: (block: Omit<PromptBlock, 'id'>) => void;
  removeFromCustomLibrary: (id: string) => void;
  generateRandomPrompt: () => void;
}

const createInitialFootage = (): Footage => ({
  id: uuidv4(),
  duration: 5,
  sceneBlocks: [],
  subjectBlocks: [],
});

export const usePromptStore = create<AppState>()(
  persist(
    (set, get) => ({
      footages: [createInitialFootage()],
      selectedFootageId: null,
      activeTab: 'scene',
      customLibrary: [],
      isSidebarOpen: true,
      isTimelineOpen: true,
      history: [],
      historyIndex: 0,

      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleTimeline: () => set((state) => ({ isTimelineOpen: !state.isTimelineOpen })),

      addFootage: () => {
        set((state) => {
          const newFootage = createInitialFootage();
          const newFootages = [...state.footages, newFootage];
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          return {
            footages: newFootages,
            selectedFootageId: newFootage.id,
            history: [...newHistory, newFootages],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      removeFootage: (id) => {
        set((state) => {
          const newFootages = state.footages.filter(f => f.id !== id);
          if (newFootages.length === 0) {
            newFootages.push(createInitialFootage());
          }
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          return {
            footages: newFootages,
            selectedFootageId: state.selectedFootageId === id ? newFootages[0].id : state.selectedFootageId,
            history: [...newHistory, newFootages],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      updateFootageDuration: (id, duration) => {
        set((state) => {
          const newFootages = state.footages.map(f => 
            f.id === id ? { ...f, duration: Math.max(2, Math.min(10, duration)) } : f
          );
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          return {
            footages: newFootages,
            history: [...newHistory, newFootages],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      reorderFootages: (newOrder) => {
        set((state) => {
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          return {
            footages: newOrder,
            history: [...newHistory, newOrder],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      selectFootage: (id) => set({ selectedFootageId: id }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      addBlock: (block) => {
        set((state) => {
          const targetId = state.selectedFootageId || state.footages[0].id;
          const targetKey = state.activeTab === 'scene' ? 'sceneBlocks' : 'subjectBlocks';
          
          const newFootages = state.footages.map(f => {
            if (f.id === targetId) {
              return { ...f, [targetKey]: [...f[targetKey], { ...block, id: uuidv4() }] };
            }
            return f;
          });

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          return {
            footages: newFootages,
            selectedFootageId: targetId,
            history: [...newHistory, newFootages],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      updateBlock: (id, content) => {
        set((state) => {
          const targetId = state.selectedFootageId || state.footages[0].id;
          const targetKey = state.activeTab === 'scene' ? 'sceneBlocks' : 'subjectBlocks';
          
          const newFootages = state.footages.map(f => {
            if (f.id === targetId) {
              return {
                ...f,
                [targetKey]: f[targetKey].map(b => b.id === id ? { ...b, content } : b)
              };
            }
            return f;
          });

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          return {
            footages: newFootages,
            history: [...newHistory, newFootages],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      removeBlock: (id) => {
        set((state) => {
          const targetId = state.selectedFootageId || state.footages[0].id;
          const targetKey = state.activeTab === 'scene' ? 'sceneBlocks' : 'subjectBlocks';
          
          const newFootages = state.footages.map(f => {
            if (f.id === targetId) {
              return {
                ...f,
                [targetKey]: f[targetKey].filter(b => b.id !== id)
              };
            }
            return f;
          });

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          return {
            footages: newFootages,
            history: [...newHistory, newFootages],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      duplicateBlock: (id) => {
        set((state) => {
          const targetId = state.selectedFootageId || state.footages[0].id;
          const targetKey = state.activeTab === 'scene' ? 'sceneBlocks' : 'subjectBlocks';
          
          const newFootages = state.footages.map(f => {
            if (f.id === targetId) {
              const blocks = f[targetKey];
              const index = blocks.findIndex(b => b.id === id);
              if (index === -1) return f;
              
              const newBlocks = [...blocks];
              newBlocks.splice(index + 1, 0, { ...blocks[index], id: uuidv4() });
              return { ...f, [targetKey]: newBlocks };
            }
            return f;
          });

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          return {
            footages: newFootages,
            history: [...newHistory, newFootages],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      setBlocks: (blocks) => {
        set((state) => {
          const targetId = state.selectedFootageId || state.footages[0].id;
          const targetKey = state.activeTab === 'scene' ? 'sceneBlocks' : 'subjectBlocks';
          
          const newFootages = state.footages.map(f => {
            if (f.id === targetId) {
              return { ...f, [targetKey]: blocks };
            }
            return f;
          });

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          return {
            footages: newFootages,
            history: [...newHistory, newFootages],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      clearBlocks: () => {
        set((state) => {
          const targetId = state.selectedFootageId || state.footages[0].id;
          const targetKey = state.activeTab === 'scene' ? 'sceneBlocks' : 'subjectBlocks';
          
          const newFootages = state.footages.map(f => {
            if (f.id === targetId) {
              return { ...f, [targetKey]: [] };
            }
            return f;
          });

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          return {
            footages: newFootages,
            history: [...newHistory, newFootages],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      undo: () => {
        set((state) => {
          if (state.historyIndex > 0) {
            return {
              historyIndex: state.historyIndex - 1,
              footages: state.history[state.historyIndex - 1],
            };
          }
          return state;
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            return {
              historyIndex: state.historyIndex + 1,
              footages: state.history[state.historyIndex + 1],
            };
          }
          return state;
        });
      },

      addToCustomLibrary: (block) => {
        set((state) => ({
          customLibrary: [...state.customLibrary, { ...block, id: uuidv4(), type: 'custom' }],
        }));
      },

      removeFromCustomLibrary: (id) => {
        set((state) => ({
          customLibrary: state.customLibrary.filter((b) => b.id !== id),
        }));
      },

      generateRandomPrompt: () => {
        const categories = Object.keys(PRELOADED_LIBRARY);
        const randomBlocks: PromptBlock[] = [];
        
        categories.forEach(category => {
          const items = PRELOADED_LIBRARY[category];
          const count = Math.floor(Math.random() * 2) + 1;
          for (let i = 0; i < count; i++) {
            const randomItem = items[Math.floor(Math.random() * items.length)];
            randomBlocks.push({ ...randomItem, id: uuidv4() });
          }
        });

        set((state) => {
          const targetId = state.selectedFootageId || state.footages[0].id;
          const targetKey = state.activeTab === 'scene' ? 'sceneBlocks' : 'subjectBlocks';
          
          const newFootages = state.footages.map(f => {
            if (f.id === targetId) {
              return { ...f, [targetKey]: randomBlocks };
            }
            return f;
          });

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          return {
            footages: newFootages,
            history: [...newHistory, newFootages],
            historyIndex: state.historyIndex + 1,
          };
        });
      },
    }),
    {
      name: 'ai-motion-prompt-builder-storage',
      partialize: (state) => ({
        customLibrary: state.customLibrary,
        footages: state.footages,
        selectedFootageId: state.selectedFootageId,
        activeTab: state.activeTab,
        isSidebarOpen: state.isSidebarOpen,
        isTimelineOpen: state.isTimelineOpen,
      }),
    }
  )
);
