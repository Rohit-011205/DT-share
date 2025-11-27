import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Role } from '../types';
import { User, Sparkles, Pencil, X, Check } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  onEdit?: (id: string, newText: string) => void;
  isLastUserMessage?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onEdit }) => {
  const isUser = message.role === Role.USER;
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);

  const handleSave = () => {
    if (editedText.trim() !== message.text) {
      onEdit?.(message.id, editedText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(message.text);
    setIsEditing(false);
  };

  return (
    <div className={`flex w-full animate-fade-in-up group ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm border-2 border-white 
          ${isUser 
            ? 'bg-gray-900 text-white' 
            : 'bg-gradient-to-br from-teal-500 to-teal-600 text-white'
          }`}>
          {isUser ? <User size={18} /> : <Sparkles size={18} />}
        </div>

        {/* Bubble */}
        <div 
          className={`relative px-6 py-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm transition-all
            ${isUser 
              ? 'bg-gray-900 text-white rounded-tr-sm' 
              : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-md'
            }
            ${isEditing ? 'w-full md:w-[500px]' : ''}
          `}
        >
          {isEditing ? (
            <div className="flex flex-col gap-3">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded-md border border-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none resize-none text-sm"
                rows={3}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={handleCancel}
                  className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
                <button 
                  onClick={handleSave}
                  className="p-1.5 rounded-md bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                  title="Save & Resubmit"
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          ) : (
            <>
              {isUser ? (
                <div className="relative">
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  {/* Edit Button for User */}
                  {onEdit && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="absolute -left-8 top-0 p-1.5 text-gray-400 hover:text-teal-600 opacity-0 group-hover:opacity-100 transition-all"
                      title="Edit message"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="prose prose-sm max-w-none 
                  prose-headings:font-bold prose-headings:text-teal-700 prose-headings:mt-3 prose-headings:mb-2 
                  prose-p:my-2 prose-p:leading-relaxed 
                  prose-ul:my-2 prose-ul:pl-4 prose-li:my-0.5 prose-li:marker:text-teal-500 
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              )}
            </>
          )}
          
          {!isEditing && (
            <span className={`text-[10px] mt-2 block font-medium opacity-60 ${isUser ? 'text-gray-300' : 'text-gray-400'}`}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;