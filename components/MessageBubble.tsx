import React from 'react';
import { Message, Sender } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.sender === Sender.AI;
  const isSystem = message.sender === Sender.SYSTEM;

  // Simple parser to handle code blocks ``` ... ```
  const renderContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Remove the backticks and optional language identifier
        const content = part.slice(3, -3).replace(/^[a-z]+\n/, ''); 
        return (
          <div key={index} className="my-3 rounded bg-black border border-green-900 overflow-x-auto relative group">
             <div className="absolute top-0 right-0 bg-green-900 text-black text-xs px-2 py-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
               CODE
             </div>
            <pre className="p-3 font-code text-green-400 text-sm whitespace-pre-wrap">
              {content.trim()}
            </pre>
          </div>
        );
      }
      
      // Inline code `...`
      const inlineParts = part.split(/(`[^`]+`)/g);
      return (
        <span key={index}>
          {inlineParts.map((subPart, subIndex) => {
             if (subPart.startsWith('`') && subPart.endsWith('`')) {
               return (
                 <code key={subIndex} className="bg-gray-800 text-green-300 px-1 rounded font-code text-sm">
                   {subPart.slice(1, -1)}
                 </code>
               );
             }
             // Handle basic bolding **text**
             const boldParts = subPart.split(/(\*\*[^*]+\*\*)/g);
             return boldParts.map((bPart, bIndex) => {
                if (bPart.startsWith('**') && bPart.endsWith('**')) {
                    return <strong key={`${subIndex}-${bIndex}`} className="text-white">{bPart.slice(2, -2)}</strong>;
                }
                return bPart;
             });
          })}
        </span>
      );
    });
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <span className="text-xs text-green-700 border border-green-900 px-2 py-1 uppercase tracking-widest">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-6 ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] md:max-w-[75%] flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
        <div className={`text-xs mb-1 opacity-50 ${isAI ? 'text-green-500' : 'text-blue-400'}`}>
          {isAI ? 'INSTRUCTOR_KERNEL' : 'OPERATOR'} <span className="text-[10px] ml-2">[{message.timestamp.toLocaleTimeString()}]</span>
        </div>
        
        <div 
          className={`
            relative p-4 rounded-sm border-l-2
            ${isAI 
              ? 'bg-[#0f0f0f] border-green-600 text-gray-300' 
              : 'bg-[#1a1a1a] border-blue-500 text-gray-200'
            }
          `}
        >
          {/* Decorative terminal corner */}
          <div className={`absolute top-0 ${isAI ? 'left-0' : 'right-0'} w-2 h-2 border-t border-${isAI ? 'green' : 'blue'}-500`}></div>

          <div className="leading-relaxed text-sm md:text-base whitespace-pre-wrap">
            {renderContent(message.text)}
            {message.isStreaming && <span className="inline-block w-2 h-4 bg-green-500 ml-1 cursor-blink align-middle"></span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;