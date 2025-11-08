'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.data.message }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Network error. Please check your connection and try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col">
      <div className="max-w-4xl w-full mx-auto flex flex-col flex-1">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-oc-green">●</span> OpenCivics AI Assistant
          </h1>
          <p className="text-terminal-fg-muted">
            Ask me anything about civic innovation, participation, or OpenCivics
          </p>
          <div className="mt-4">
            <Link href="/" className="text-oc-green hover:text-oc-blue text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 terminal-window overflow-y-auto mb-6 max-h-[60vh]">
          {messages.length === 0 && (
            <div className="text-center text-terminal-fg-muted py-12">
              <p className="text-lg mb-4">👋 Hello! How can I help you explore OpenCivics today?</p>
              <p className="text-sm">Try asking about:</p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• What is OpenCivics?</li>
                <li>• Tell me about the four archetypes</li>
                <li>• How can I get involved?</li>
                <li>• What are civic innovation domains?</li>
              </ul>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-oc-green/10 border border-oc-green/30 ml-8'
                    : 'bg-terminal-bg border border-terminal-border mr-8'
                }`}
              >
                <div className="text-xs text-terminal-fg-muted mb-1 uppercase font-mono">
                  {message.role === 'user' ? 'You' : 'OpenCivics AI'}
                </div>
                <div className="text-terminal-fg whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="p-4 rounded-lg bg-terminal-bg border border-terminal-border mr-8">
                <div className="text-xs text-terminal-fg-muted mb-1 uppercase font-mono">
                  OpenCivics AI
                </div>
                <div className="flex items-center gap-2">
                  <div className="loading-spinner w-4 h-4" />
                  <span className="text-terminal-fg-muted">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="textarea flex-1 min-h-[60px] max-h-[200px]"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="btn btn-primary self-end disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
