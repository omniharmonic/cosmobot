'use client';

export default function TypingIndicator() {
  return (
    <div className="chat-message bot">
      <div className="message-bubble bot">
        <div className="typing-indicator">
          <div className="typing-dots">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
          <span className="typing-text">OpenCivics is typing...</span>
        </div>
      </div>
    </div>
  );
}