'use client';

import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date | string;

  // Optional interactive elements
  buttons?: MessageButton[];
  inputField?: {
    type: 'text' | 'textarea';
    placeholder: string;
    questionId: string;
  };

  // Metadata
  questionId?: string;
  questionType?: 'single_select' | 'multi_select' | 'text' | 'conversation';
}

export interface MessageButton {
  id: string;
  label: string;
  value: string;
  icon?: string;
  selected?: boolean;
}

interface ChatInterfaceProps {
  initialMessage?: ChatMessage;
}

export default function ChatInterface({ initialMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [sessionId] = useState<string>(`session_${Date.now()}`); // Generate once and reuse
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize with welcome message if no initial message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = initialMessage || {
        id: '1',
        role: 'bot',
        content: 'Hi there! 👋 Welcome to **OpenCivics**. I\'m here to help you explore civic innovation and discover how you can make an impact.\n\nWhat brings you here today? Are you curious about civic innovation, looking to get involved, or want to learn about your role in creating change?',
        timestamp: new Date(),
        buttons: [
          { id: 'start', label: 'Start Quiz', value: 'start_quiz', icon: '🎓' },
          { id: 'learn', label: 'Learn More', value: 'learn_more', icon: '📚' },
          { id: 'explore', label: 'Explore Resources', value: 'explore_resources', icon: '🔍' },
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleUserMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    try {
      await callChatAPIWithHistory(content);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleButtonClick = async (buttonValue: string, messageId: string) => {
    // Find the button before updating state
    const button = messages.find(m => m.id === messageId)?.buttons?.find(b => b.value === buttonValue);

    // Update the message to show button selection
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          buttons: msg.buttons?.map(btn => ({
            ...btn,
            selected: btn.value === buttonValue
          }))
        };
      }
      return msg;
    }));

    // Create user response showing what they selected
    const userMessage: ChatMessage = button ? {
      id: Date.now().toString(),
      role: 'user',
      content: button.label,
      timestamp: new Date(),
    } : {
      id: Date.now().toString(),
      role: 'user',
      content: buttonValue,
      timestamp: new Date(),
    };

    // Add user message to state
    setMessages(prev => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Include the user message in the conversation history when calling API
      const updatedHistory = [...messages, userMessage];
      // Send the button VALUE (not label) to the backend
      await callChatAPIWithHistory(buttonValue, updatedHistory);
    } catch (error) {
      console.error('Error handling button click:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleInlineInput = async (value: string, questionId: string, messageId: string) => {
    // Add user response
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: value,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Remove input field from the bot message
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, inputField: undefined };
      }
      return msg;
    }));

    // Show typing indicator
    setIsTyping(true);

    try {
      await callChatAPIWithHistory(`${questionId}:${value}`);
    } catch (error) {
      console.error('Error handling inline input:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // Call chat onboarding API with custom history
  const callChatAPIWithHistory = async (userInput: string, customHistory?: ChatMessage[]): Promise<void> => {
    try {
      const response = await fetch('/api/chat/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          conversationHistory: customHistory || messages,
          profileId: profileId,
          sessionId: sessionId // Use the stored sessionId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update profile if returned
      if (data.profile) {
        setProfileId(data.profile.id);
      }

      // Add bot response
      const botResponse: ChatMessage = {
        ...data.message,
        id: Date.now().toString(),
        timestamp: new Date(data.message.timestamp),
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error calling chat API:', error);
      // Fallback message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'bot',
        content: 'I apologize, but I encountered an issue. Let me try to help you in a different way. What would you like to know about OpenCivics?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="terminal-window">
      {/* macOS Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-controls">
          <div className="terminal-control close"></div>
          <div className="terminal-control minimize"></div>
          <div className="terminal-control maximize"></div>
        </div>
        <div className="terminal-title">
          <img
            src={theme === 'dark' ? '/logo-green.svg' : '/logo-blue.svg'}
            alt="OpenCivics"
            className="logo-icon w-3 h-3 object-contain"
          />
          <span className="terminal-title-text">OpenCivics</span>
        </div>
        <div className="terminal-spacer">
          {/* Theme toggle - hidden on mobile, visible on desktop */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="terminal-content">
        <div className="chat-messages">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onButtonClick={handleButtonClick}
              onInlineInput={handleInlineInput}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          onSendMessage={handleUserMessage}
          disabled={isTyping}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}