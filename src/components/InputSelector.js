import React from 'react';
import './InputSelector.css';
import { DETECTION_TYPES } from '../utils/moodDetection/constants';

function InputSelector({ activeInput, onInputChange }) {
  return (
    <div className="input-selector">
      <div className="input-type-toggle">
        <button 
          className={activeInput === DETECTION_TYPES.EMOJI ? 'active' : ''}
          onClick={() => onInputChange(DETECTION_TYPES.EMOJI)}
        >
          <span className="input-icon">🎭</span>
          <span className="input-label">Emoji Slider</span>
        </button>
        <button 
          className={activeInput === DETECTION_TYPES.CHAT ? 'active' : ''}
          onClick={() => onInputChange(DETECTION_TYPES.CHAT)}
        >
          <span className="input-icon brain-icon">🧠</span>
          <span className="input-label">AI Chat <span className="experimental-label">✨ AI</span></span>
        </button>
      </div>
    </div>
  );
}

export default InputSelector;
