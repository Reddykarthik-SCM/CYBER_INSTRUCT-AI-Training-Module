import React, { useState, useRef, useEffect } from 'react';
import { Message, Sender, Topic, TOPIC_GREETINGS } from '../types';
import { sendMessageStream, initChat } from '../services/geminiService';
import MessageBubble from './MessageBubble';

interface TerminalProps {
  currentTopic: Topic;
}

const Terminal: React.FC<TerminalProps> = ({ currentTopic }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat when topic changes
  useEffect(() => {
    const initializeSession = async () => {
      setMessages([]);
      setIsLoading(true);
      
      // Add system initialization message
      const sysMsg: Message = {
        id: 'sys-init',
        text: `Initializing environment... Loading ${currentTopic} modules...`,
        sender: Sender.SYSTEM,
        timestamp: new Date()
      };
      setMessages([sysMsg]);

      await initChat(currentTopic);

      // Add greeting
      const greetingMsg: Message = {
        id: 'ai-greeting',
        text: TOPIC_GREETINGS[currentTopic],
        sender: Sender.AI,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, greetingMsg]);
      setIsLoading(false);
    };

    initializeSession();
  }, [currentTopic]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    
    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: Sender.USER,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Create a placeholder for AI response
      const aiMsgId = (Date.now() + 1).toString();
      const aiMsgPlaceholder: Message = {
        id: aiMsgId,
        text: '',
        sender: Sender.AI,
        timestamp: new Date(),
        isStreaming: true
      };
      
      setMessages(prev => [...prev, aiMsgPlaceholder]);

      let fullResponse = '';
      
      const stream = sendMessageStream(userText);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, text: fullResponse } 
            : msg
        ));
      }

      // Finalize message
      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId 
          ? { ...msg, isStreaming: false } 
          : msg
      ));

    } catch (error) {
      console.error("Chat Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden">
      {/* Matrix-like background noise (optional, handled by CSS in index.html mostly) */}
      
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-green-900 bg-[#0a0a0a] z-10">
        <div className="flex items-center space-x-2">
           <div className="w-3 h-3 rounded-full bg-red-500"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
           <div className="w-3 h-3 rounded-full bg-green-500"></div>
           <span className="ml-4 text-green-600 text-xs tracking-widest font-bold">ROOT@INSTRUCTOR:~/{currentTopic.replace(/ /g, '_').toUpperCase()}</span>
        </div>
        <div className="text-[10px] text-green-800 font-mono">SECURE_CHANNEL_V1.0</div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10 scrollbar-thin">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0a0a0a] border-t border-green-900 z-10">
        <div className="flex items-end space-x-2 max-w-5xl mx-auto">
          <span className="text-green-500 pb-3 font-bold">{'>'}</span>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command or query..."
            className="flex-1 bg-transparent text-gray-200 focus:outline-none font-mono resize-none py-3 px-2 h-12 max-h-32 focus:ring-0 border-none placeholder-gray-700"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className={`
              px-6 py-2 rounded-sm font-bold tracking-wider text-sm transition-all
              ${isLoading || !inputValue.trim() 
                ? 'bg-gray-900 text-gray-600 cursor-not-allowed' 
                : 'bg-green-700 text-black hover:bg-green-600 hover:shadow-[0_0_10px_rgba(0,255,65,0.5)]'
              }
            `}
          >
            EXECUTE
          </button>
        </div>
        <div className="text-center mt-2">
            <span className="text-[10px] text-gray-600 uppercase">Use strictly for educational & authorized testing only.</span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;