import React from 'react';
import { Sidebar } from './Sidebar';
import { SceneBuilder } from './SceneBuilder';
import { Header } from './Header';
import { Timeline } from './Timeline';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { usePromptStore } from '../store/usePromptStore';

export function Layout() {
  const { isSidebarOpen, isTimelineOpen, toggleSidebar, toggleTimeline } = usePromptStore();

  return (
    <div className="flex h-screen w-full flex-col bg-slate-950 text-slate-50 overflow-hidden font-sans">
      <Header onMenuClick={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <div className={`
          absolute lg:relative z-50 h-full bg-slate-900 border-slate-800 transition-all duration-300 ease-in-out shrink-0
          ${isSidebarOpen ? 'w-80 border-r translate-x-0' : 'w-0 border-r-0 -translate-x-full lg:translate-x-0 overflow-hidden'}
        `}>
          <div className="w-80 h-full">
            <Sidebar onClose={toggleSidebar} />
          </div>
        </div>

        {/* Sidebar Toggle Button (Desktop) */}
        <div 
          className="hidden lg:flex items-center absolute z-40 transition-all duration-300 ease-in-out" 
          style={{ 
            left: isSidebarOpen ? '20rem' : '1rem', 
            top: '50%', 
            transform: isSidebarOpen ? 'translate(-50%, -50%)' : 'translateY(-50%)' 
          }}
        >
          <button 
            onClick={toggleSidebar} 
            className="bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-full p-1 shadow-lg hover:bg-slate-700 transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            <SceneBuilder />
          </div>

          {/* Timeline Toggle Button */}
          <div 
            className="absolute z-40 flex justify-center w-full transition-all duration-300 ease-in-out pointer-events-none" 
            style={{ bottom: isTimelineOpen ? '16rem' : '1rem', transform: isTimelineOpen ? 'translateY(50%)' : 'none' }}
          >
            <button 
              onClick={toggleTimeline} 
              className="bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-full p-1 shadow-lg hover:bg-slate-700 transition-colors pointer-events-auto"
            >
              {isTimelineOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          <div className={`border-t border-slate-800 bg-slate-900/50 transition-all duration-300 ease-in-out shrink-0 ${isTimelineOpen ? 'h-64 p-4' : 'h-0 overflow-hidden'}`}>
            <div className="h-full min-h-[14rem]">
              <Timeline />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
