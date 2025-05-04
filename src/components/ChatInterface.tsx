import React, { useState, useEffect, useRef } from 'react';
import { Send, BrainCircuit } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import ChatMessage from './chat/ChatMessage';

const ChatInterface: React.FC = () => {
  const { 
    chatMessages, 
    sendChatMessage, 
    selectedResult, 
    setActiveTab,
    clearChat
  } = useApp();
  
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendChatMessage(message.trim());
      setMessage('');
    }
  };
  
  const noResultsSelected = !selectedResult;
  
  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[600px]">
        {/* Chat header */}
        <div className="bg-primary-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6" />
            <h2 className="font-semibold">MediScan AI Assistant</h2>
          </div>
          <button 
            onClick={clearChat} 
            className="text-xs py-1 px-2 bg-primary-400 hover:bg-primary-600 rounded transition-colors"
          >
            Clear Chat
          </button>
        </div>
        
        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {noResultsSelected ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <BrainCircuit className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Analysis Selected</h3>
              <p className="text-gray-500 mb-6">
                You need to upload and analyze a medical image or report before using the chat assistant.
              </p>
              <button 
                className="btn-primary"
                onClick={() => setActiveTab('upload')}
              >
                Upload Now
              </button>
            </div>
          ) : chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <BrainCircuit className="h-12 w-12 text-primary-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">AI Assistant Ready</h3>
              <p className="text-gray-500 mb-2">
                I've analyzed your medical data. What would you like to know?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 w-full max-w-lg">
                <button
                  className="btn-outline text-sm text-left p-2"
                  onClick={() => sendChatMessage("What does this diagnosis mean?")}
                >
                  What does this diagnosis mean?
                </button>
                <button
                  className="btn-outline text-sm text-left p-2"
                  onClick={() => sendChatMessage("What are the treatment options?")}
                >
                  What are the treatment options?
                </button>
                <button
                  className="btn-outline text-sm text-left p-2"
                  onClick={() => sendChatMessage("What are the main symptoms?")}
                >
                  What are the main symptoms?
                </button>
                <button
                  className="btn-outline text-sm text-left p-2"
                  onClick={() => sendChatMessage("How severe is this condition?")}
                >
                  How severe is this condition?
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatMessages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Chat input area */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={noResultsSelected ? "Please analyze an image or report first..." : "Ask about your medical results..."}
              className="input flex-1"
              disabled={noResultsSelected}
            />
            <button
              type="submit"
              className={`btn-primary !p-2 ${noResultsSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={noResultsSelected || !message.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;