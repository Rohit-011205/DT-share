import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles,  Home } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Content } from '@google/genai';

import { ChatState, EducationStage, Message, Role } from './types';
import { SYSTEM_INSTRUCTION_BASE } from './constants';
import { initializeChat, sendMessageStream, sendMessageToGemini } from './services/geminiService';

import MessageBubble from './components/MessageBubble';
import TypingIndicator from './components/TypingIndicator';
import StageSelector from './components/StageSelector';

const App: React.FC = () => {
  // State
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    stage: EducationStage.UNSELECTED,
    hasStarted: false,
  });
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isLoading]);

  // Initialize Chat with Stage
  const handleStageSelect = async (stage: EducationStage) => {
    setChatState(prev => ({ ...prev, stage, hasStarted: true, isLoading: true }));

    const fullSystemPrompt = `${SYSTEM_INSTRUCTION_BASE}\n\n$`;
    initializeChat(fullSystemPrompt);

    // Initial greeting generation
    try {
      const initialPrompt = `The user has just started the session and selected the stage: "${stage}". 
      Introduce yourself warmly as EDGO. 
      Briefly acknowledge their stage.
      Then, ask for their **Name** to begin the counseling session. Do not ask any other questions yet.`;
      
      const responseText = await sendMessageToGemini(initialPrompt);
      
      const welcomeMessage: Message = {
        id: uuidv4(),
        role: Role.MODEL,
        text: responseText,
        timestamp: Date.now(),
      };

      setChatState(prev => ({
        ...prev,
        isLoading: false,
        messages: [welcomeMessage]
      }));
    } catch (error) {
      console.error("Failed to start chat", error);
      setChatState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Helper to process streaming response
  const processStreamResponse = async (inputText: string, botMessageId: string) => {
    try {
      const stream = sendMessageStream(inputText);
      let fullResponse = "";

      for await (const chunk of stream) {
        fullResponse += chunk;
        
        setChatState(prev => {
          const newMessages = [...prev.messages];
          // Find the bot message by ID and update it
          const msgIndex = newMessages.findIndex(m => m.id === botMessageId);
          if (msgIndex !== -1) {
            newMessages[msgIndex] = {
              ...newMessages[msgIndex],
              text: fullResponse
            };
          }
          return { ...prev, messages: newMessages };
        });
      }

      setChatState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error("Stream Error", error);
      setChatState(prev => ({ 
        ...prev, 
        isLoading: false,
        messages: [...prev.messages.slice(0, -1), { 
          id: botMessageId,
          role: Role.MODEL,
          text: "I'm having trouble connecting. Please try again.",
          timestamp: Date.now()
        }] 
      }));
    }
  };

  // Handle User Message (New)
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || chatState.isLoading) return;

    const userText = inputText.trim();
    setInputText('');

    // 1. Add User Message
    const userMessage: Message = {
      id: uuidv4(),
      role: Role.USER,
      text: userText,
      timestamp: Date.now(),
    };

    // 2. Prepare Placeholder Bot Message
    const botMessageId = uuidv4();
    const initialBotMessage: Message = {
      id: botMessageId,
      role: Role.MODEL,
      text: '',
      timestamp: Date.now(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage, initialBotMessage],
      isLoading: true
    }));

    // 3. Stream Response
    await processStreamResponse(userText, botMessageId);
  };

  // Handle Edit Message
  const handleEditMessage = async (messageId: string, newText: string) => {
    if (chatState.isLoading) return;

    const msgIndex = chatState.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    // 1. Slice history up to this message (exclusive)
    // This removes the old version of this message and everything after it
    const previousMessages = chatState.messages.slice(0, msgIndex);
    
    // 2. Create the updated message object
    const editedMessage: Message = {
      ...chatState.messages[msgIndex],
      text: newText,
      timestamp: Date.now() // Update timestamp to show it's fresh
    };

    // 3. Prepare Placeholder Bot Message
    const botMessageId = uuidv4();
    const initialBotMessage: Message = {
      id: botMessageId,
      role: Role.MODEL,
      text: '',
      timestamp: Date.now(),
    };

    // 4. Update State immediately
    setChatState(prev => ({
      ...prev,
      messages: [...previousMessages, editedMessage, initialBotMessage],
      isLoading: true
    }));

    // 5. Re-initialize Chat Session with truncated history
    // Convert previousMessages to Gemini Content format
    const historyPayload: Content[] = previousMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const fullSystemPrompt = `${SYSTEM_INSTRUCTION_BASE}\n\n$`;
    initializeChat(fullSystemPrompt, historyPayload);

    // 6. Generate Response
    await processStreamResponse(newText, botMessageId);
  };

  const handleBackToHome = () => {
    if (chatState.messages.length > 0) {
      if (confirm("Going back will end the current session. Are you sure?")) {
        setChatState({
          messages: [],
          isLoading: false,
          stage: EducationStage.UNSELECTED,
          hasStarted: false,
        });
      }
    } else {
      setChatState(prev => ({ ...prev, hasStarted: false, stage: EducationStage.UNSELECTED }));
    }
  };

  if (!chatState.hasStarted) {
    return <StageSelector onSelect={handleStageSelect} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-2.5 rounded-xl text-white shadow-md">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-lg leading-tight">EDGO AI</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <p className="text-xs text-gray-500 font-medium">{chatState.stage} Counselor</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium border border-transparent hover:border-teal-100"
            title="Back to Home"
          >
            <Home size={18} />
            <span className="hidden md:inline">Back to Home</span>
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          {/* Welcome Note */}
          {chatState.messages.length > 0 && (
             <div className="text-center py-4">
               <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Session Started</p>
             </div>
          )}

          {chatState.messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              onEdit={handleEditMessage} 
            />
          ))}
          
          {chatState.isLoading && chatState.messages[chatState.messages.length - 1]?.role === Role.USER && (
            <TypingIndicator />
          )}
          
          <div ref={messagesEndRef} className="h-px" />
        </div>
      </main>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 p-4 md:p-6 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSendMessage}
            className="relative flex items-end gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10 transition-all duration-300"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your answer here..."
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-gray-800 placeholder-gray-400 text-base max-h-32"
              disabled={chatState.isLoading}
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || chatState.isLoading}
              className={`p-3 rounded-xl flex-shrink-0 shadow-sm transition-all duration-200 
                ${!inputText.trim() || chatState.isLoading 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md active:scale-95'
                }`}
            >
              <Send size={20} />
            </button>
          </form>
          <div className="mt-3 flex justify-center items-center gap-2 text-[10px] text-gray-400">
            <span>Powered by Google Gemini</span>
            <span>•</span>
            <span>Career Advice based on Indian Standards</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;