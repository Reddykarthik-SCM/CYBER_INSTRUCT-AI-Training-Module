import React from 'react';
import { Topic } from '../types';

interface SidebarProps {
  currentTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTopic, onSelectTopic, isOpen, toggleSidebar }) => {
  const topics = Object.values(Topic);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <div 
        className={`
          fixed md:relative top-0 left-0 h-full w-64 bg-[#080808] border-r border-green-900 z-30 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-green-900">
          <h1 className="text-green-500 font-bold text-xl tracking-tighter flex items-center">
            <span className="text-2xl mr-2">⫸</span>
            CYBER_INSTRUCT
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-mono">AI Training Module</p>
        </div>

        <nav className="p-4 space-y-2">
          <div className="text-[10px] text-gray-600 mb-4 font-bold tracking-widest uppercase">Select Module</div>
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => {
                onSelectTopic(topic);
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={`
                w-full text-left px-4 py-3 text-sm font-mono border-l-2 transition-all duration-200 group
                ${currentTopic === topic 
                  ? 'border-green-500 bg-green-900/20 text-green-400 shadow-[0_0_15px_rgba(0,255,65,0.1)]' 
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-[#111]'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span>{topic}</span>
                {currentTopic === topic && <span className="text-[10px] animate-pulse">●</span>}
              </div>
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-900/50 bg-[#080808]">
          <div className="text-[10px] text-gray-600 font-mono">
            <div className="flex justify-between mb-1">
              <span>SYSTEM_STATUS:</span>
              <span className="text-green-600">ONLINE</span>
            </div>
            <div className="flex justify-between mb-1">
               <span>ENCRYPTION:</span>
               <span className="text-green-600">AES-256</span>
            </div>
            <div className="flex justify-between">
               <span>LATENCY:</span>
               <span className="text-green-600">12ms</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;