'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage as ChatMessageType, MessageButton } from './ChatInterface';
import MessageButtons from './MessageButtons';
import MessageInput from './MessageInput';

interface ChatMessageProps {
  message: ChatMessageType;
  onButtonClick: (buttonValue: string, messageId: string) => void;
  onInlineInput: (value: string, questionId: string, messageId: string) => void;
}

export default function ChatMessage({
  message,
  onButtonClick,
  onInlineInput
}: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isBot = message.role === 'bot';

  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`chat-message ${message.role}`}>
      <div className={`message-bubble ${message.role}`}>
        {/* Message Content */}
        <div className="message-content">
          {isBot ? (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                pre: ({ children }) => <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm font-mono overflow-x-auto">{children}</pre>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r">{children}</blockquote>,
                h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-medium mb-1">{children}</h3>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            message.content
          )}
        </div>

        {/* Interactive Elements */}
        {message.buttons && message.buttons.length > 0 && (
          <MessageButtons
            buttons={message.buttons}
            onButtonClick={(buttonValue) => onButtonClick(buttonValue, message.id)}
          />
        )}

        {message.inputField && (
          <MessageInput
            inputConfig={message.inputField}
            onSubmit={(value) => onInlineInput(value, message.inputField!.questionId, message.id)}
          />
        )}

        {/* Timestamp */}
        <div className="text-xs text-foreground-secondary mt-2 opacity-60">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}