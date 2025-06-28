import React, { useState, useEffect } from 'react';
import './MoodInput.css';
import { DETECTION_TYPES } from '../utils/moodDetection/constants';

function MoodInput({ onMoodSubmit, lastInput, lastInputType, showReset, onReset }) {
  const [emojiValue, setEmojiValue] = useState(5); // Middle value on scale of 0-10
  
  // Update component state when lastInput changes
  useEffect(() => {
    if (lastInputType === DETECTION_TYPES.EMOJI && lastInput !== null) {
      setEmojiValue(lastInput);
    }
  }, [lastInput, lastInputType]);
  
  // Enhanced emoji mapping for the slider with more emotions
  const emojiMap = [
    "😔", // Sad
    "😟", // Worried
    "😐", // Neutral
    "🙂", // Slightly Happy
    "😊", // Content
    "😃", // Happy
    "�", // Cool
    "😤", // Focused
    "😡", // Angry
    "🥳", // Party
    "😴"  // Sleepy
  ];

  const handleEmojiSubmit = () => {
    onMoodSubmit(emojiValue, DETECTION_TYPES.EMOJI);
  };

  const handleReset = () => {
    // Reset local state
    setEmojiValue(5);
    
    // Call parent reset function
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="mood-input">
      <div className="emoji-input-form">
        <div className="emoji-header">
          <h3>Mood Slider</h3>
          <p>Move the slider to match your current mood</p>
          {showReset && (
            <button className="reset-button" onClick={handleReset} aria-label="Reset">
              <span className="reset-icon">↺</span>
            </button>
          )}
        </div>
        
        <div className="emoji-slider-container">
          <div className="emoji-label mood-sad">{emojiMap[0]}</div>
          <input
            type="range"
            id="mood-emoji"
            min="0"
            max="10"
            value={emojiValue}
            onChange={(e) => setEmojiValue(parseInt(e.target.value))}
            className="emoji-slider"
          />
          <div className="emoji-label mood-energetic">{emojiMap[10]}</div>
        </div>
        
        <div className="mood-details">
          <div className="current-emoji">{emojiMap[emojiValue]}</div>
          <div className="mood-description">
            {emojiValue <= 2 && "Feeling down or sad"}
            {emojiValue > 2 && emojiValue <= 4 && "Feeling calm and peaceful"}
            {emojiValue > 4 && emojiValue <= 6 && "Feeling focused or content"}
            {emojiValue > 6 && emojiValue <= 8 && "Feeling happy and upbeat"}
            {emojiValue > 8 && "Feeling energetic or intense"}
          </div>
        </div>
        
        <button onClick={handleEmojiSubmit} className="find-music-btn">Find Music for My Mood</button>
      </div>
    </div>
  );
}

export default MoodInput;
