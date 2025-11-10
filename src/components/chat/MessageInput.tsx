'use client';

import { useState } from 'react';

interface MessageInputProps {
  inputConfig: {
    type: 'text' | 'textarea';
    placeholder: string;
    questionId: string;
  };
  onSubmit: (value: string) => void;
}

export default function MessageInput({ inputConfig, onSubmit }: MessageInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && inputConfig.type === 'text') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      {inputConfig.type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={inputConfig.placeholder}
          className="message-textarea"
          rows={3}
          autoFocus
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={inputConfig.placeholder}
          className="message-input"
          autoFocus
        />
      )}
      <button
        type="submit"
        disabled={!value.trim()}
        className="message-submit-button"
      >
        Send
      </button>
    </form>
  );
}