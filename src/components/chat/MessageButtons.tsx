'use client';

import { MessageButton } from './ChatInterface';

interface MessageButtonsProps {
  buttons: MessageButton[];
  onButtonClick: (buttonValue: string) => void;
}

export default function MessageButtons({ buttons, onButtonClick }: MessageButtonsProps) {
  return (
    <div className="message-buttons">
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={() => onButtonClick(button.value)}
          className={`message-button ${button.selected ? 'selected' : ''}`}
          disabled={button.selected}
        >
          {button.icon && <span className="button-icon">{button.icon}</span>}
          <span className="button-label">{button.label}</span>
        </button>
      ))}
    </div>
  );
}