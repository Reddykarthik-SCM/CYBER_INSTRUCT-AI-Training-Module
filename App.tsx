import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Terminal from './components/Terminal';
import { Topic } from './types';

const App: React.FC = () => {
  const [currentTopic, setCurrentTopic] = useState<Topic>(Topic.GENERAL);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-black text-white font-mono overflow-hidden">
      
      {/* Mobile Header Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-green-500 p-2 border border-green-900 bg-black hover:bg-green-900/30 rounded"
        >
          {isSidebarOpen ? '✖' : '☰'}
        </button>
      </div>

      <Sidebar 
        currentTopic={currentTopic} 
        onSelectTopic={setCurrentTopic}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 relative h-full">
        <Terminal currentTopic={currentTopic} />
      </main>

    </div>
  );
};

export default App;