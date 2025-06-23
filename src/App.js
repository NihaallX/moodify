import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MoodInput from './components/MoodInput';
import MoodMessage from './components/MoodMessage';
import PlaylistRecommendation from './components/PlaylistRecommendation';
import SpotifyLoginButton from './components/SpotifyLoginButton';
import SpotifyCallback from './components/SpotifyCallback';
import UserProfile from './components/UserProfile';
import LocalDevAuth from './components/LocalDevAuth';
import { detectMood } from './utils/moodDetector';
import spotifyService from './services/spotifyService';

function App() {
  const [currentMood, setCurrentMood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkAuthStatus = () => {
      const loggedIn = spotifyService.isLoggedIn();
      setIsAuthenticated(loggedIn);
    };

    checkAuthStatus();
    
    // Set up an interval to periodically check auth status
    const intervalId = setInterval(checkAuthStatus, 60000); // check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  const handleMoodSubmission = async (input, inputType) => {
    setIsLoading(true);
    
    // Detect mood based on input
    const detectedMood = await detectMood(input, inputType);
    setCurrentMood(detectedMood);
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Main application content
  const AppContent = () => (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">          <img 
            src={`${process.env.PUBLIC_URL}/images/moodify-logo.png`} 
            alt="Moodify Logo" 
            className="logo" 
          />
        </div>
        <h1>Moodify</h1>
        <p className="App-subtitle">Music recommendations based on your mood</p>
          {isAuthenticated ? (
          <UserProfile onLogout={handleLogout} />
        ) : (
          <SpotifyLoginButton />
        )}
      </header>
      
      {!isAuthenticated && process.env.NODE_ENV === 'development' && (
        <LocalDevAuth />
      )}
      
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
    </div>  );
  // More comprehensive check for callback parameters
  const hasCallbackParams = () => {
    // Check in query parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code') && urlParams.has('state')) {
      return true;
    }
    
    // Check in hash (for HashRouter)
    if (window.location.hash) {
      // Check if hash contains a question mark
      if (window.location.hash.includes('?')) {
        const hashParams = new URLSearchParams(window.location.hash.substring(window.location.hash.indexOf('?')));
        if (hashParams.has('code') && hashParams.has('state')) {
          return true;
        }
      }
      
      // Check directly in hash (GitHub Pages specific)
      if (window.location.hash.includes('code=') && window.location.hash.includes('state=')) {
        return true;
      }
    }
    
    return false;
  };
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={hasCallbackParams() ? <SpotifyCallback /> : <AppContent />} />
        <Route path="/callback" element={<SpotifyCallback />} /> {/* Keeping this for backward compatibility */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
