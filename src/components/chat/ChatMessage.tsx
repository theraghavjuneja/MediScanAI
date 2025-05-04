import React from 'react';
import { User, Bot } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  if (message.isTyping) {
    return (
      <div className="flex items-start space-x-2 animate-fade-in">
        <div className="bg-secondary-100 text-secondary-800 rounded-lg p-3 flex items-center">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`flex items-start space-x-2 animate-fade-in ${isUser ? 'justify-end' : ''}`}
    >
      {!isUser && (
        <div className="bg-secondary-100 text-secondary-800 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot size={18} />
        </div>
      )}
      
      <div 
        className={`rounded-lg p-3 max-w-[80%] ${
          isUser 
            ? 'bg-primary-500 text-white' 
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {message.content}
      </div>
      
      {isUser && (
        <div className="bg-primary-100 text-primary-800 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={18} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;