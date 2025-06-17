import React, { useState } from 'react';
import './App.css';
import MoodInput from './components/MoodInput';
import MoodMessage from './components/MoodMessage';
import PlaylistRecommendation from './components/PlaylistRecommendation';
import { detectMood } from './utils/moodDetector';

function App() {
  const [currentMood, setCurrentMood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMoodSubmission = async (input, inputType) => {
    setIsLoading(true);
    
    // Detect mood based on input
    const detectedMood = await detectMood(input, inputType);
    setCurrentMood(detectedMood);
    
    setIsLoading(false);
  };

  return (
    <div className="App">      <header className="App-header">
        <div className="logo-container">
          <img src="/moodify/images/moodify-logo.png" alt="Moodify Logo" className="logo" />
        </div>
        <h1>Moodify</h1>
        <p className="App-subtitle">Music recommendations based on your mood</p>
      </header>
      
      <main className="App-main">
        <MoodInput onMoodSubmit={handleMoodSubmission} />
        
        {isLoading && <div className="loader">Analyzing your mood...</div>}
        
        {currentMood && !isLoading && (
          <div className="results-container">
            <MoodMessage mood={currentMood} />
            <PlaylistRecommendation mood={currentMood} />
          </div>
        )}
      </main>
        <footer className="App-footer">
        <p>© {new Date().getFullYear()} Moodify</p>
        <p className="made-with-love">Made with ❤️ by Nihal</p>
      </footer>
    </div>
  );
}

export default App;
