import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full mb-6 justify-start animate-pulse">
      <div className="flex max-w-[75%] flex-row items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-sm">
          <Bot size={16} />
        </div>
        <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1 h-10 shadow-sm">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;