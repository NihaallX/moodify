import React, { useState } from 'react';
import './MoodInput.css';

function MoodInput({ onMoodSubmit }) {
  const [inputType, setInputType] = useState('text'); // 'text' or 'emoji'
  const [textInput, setTextInput] = useState('');
  const [emojiValue, setEmojiValue] = useState(5); // Middle value on scale of 0-10
  
  // Emoji mapping for the slider
  const emojiMap = [
    '😔', '😟', '😐', '🙂', '😊', 
    '😃', '😎', '😤', '😡', '🥳', '😴'
  ];

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      onMoodSubmit(textInput, 'text');
    }
  };

  const handleEmojiSubmit = () => {
    onMoodSubmit(emojiValue, 'emoji');
  };

  return (
    <div className="mood-input">
      <div className="input-type-toggle">
        <button 
          className={inputType === 'text' ? 'active' : ''}
          onClick={() => setInputType('text')}
        >
          Text Input
        </button>
        <button 
          className={inputType === 'emoji' ? 'active' : ''}
          onClick={() => setInputType('emoji')}
        >
          Emoji Slider
        </button>
      </div>

      {inputType === 'text' ? (
        <form onSubmit={handleTextSubmit} className="text-input-form">
          <label htmlFor="mood-text">How are you feeling today?</label>
          <input
            type="text"
            id="mood-text"
            placeholder="E.g., I'm feeling a bit down today"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button type="submit">Find Music</button>
        </form>
      ) : (
        <div className="emoji-input-form">
          <label htmlFor="mood-emoji">Select your mood:</label>
          <div className="emoji-slider-container">
            <div className="emoji-label">{emojiMap[0]}</div>
            <input
              type="range"
              id="mood-emoji"
              min="0"
              max="10"
              value={emojiValue}
              onChange={(e) => setEmojiValue(parseInt(e.target.value))}
              className="emoji-slider"
            />
            <div className="emoji-label">{emojiMap[10]}</div>
          </div>
          <div className="current-emoji">{emojiMap[emojiValue]}</div>
          <button onClick={handleEmojiSubmit}>Find Music</button>
        </div>
      )}
    </div>
  );
}

export default MoodInput;
