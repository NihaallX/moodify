import React, { useState, useEffect } from 'react';
import './MoodInput.css';

function MoodInput({ onMoodSubmit, lastInput, lastInputType, showReset, onReset }) {
  const [inputType, setInputType] = useState(lastInputType || 'emoji'); // Default to emoji mode
  const [textInput, setTextInput] = useState('');
  const [emojiValue, setEmojiValue] = useState(5); // Middle value on scale of 0-10
  
  // Update component state when lastInput changes
  useEffect(() => {
    if (lastInputType === 'text' && lastInput) {
      setTextInput(lastInput);
      setInputType('text');
    } else if (lastInputType === 'emoji' && lastInput !== null) {
      setEmojiValue(lastInput);
      setInputType('emoji');
    }
  }, [lastInput, lastInputType]);
  
  // Emoji mapping for the slider
  const emojiMap = [
    "😔", "😟", "😐", "🙂", "😊", 
    "😃", "😎", "😤", "😡", "🥳", "😴"
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

  const handleReset = () => {
    // Reset local state
    setTextInput('');
    setEmojiValue(5);
    setInputType('emoji'); // Default to emoji mode on reset
    
    // Call parent reset function
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="mood-input">
      <div className="input-type-toggle-container">
        <div className="input-type-toggle">
          <button 
            className={inputType === 'emoji' ? 'active' : ''}
            onClick={() => setInputType('emoji')}
          >
            Emoji Mode
          </button>
          <button 
            className={inputType === 'text' ? 'active' : ''}
            onClick={() => setInputType('text')}
          >
            Text Mode
          </button>
          {showReset && (
            <button className="reset-button" onClick={handleReset}>
              <span className="reset-icon">↺</span>
            </button>
          )}
        </div>
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
