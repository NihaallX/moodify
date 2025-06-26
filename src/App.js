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
  const [lastInput, setLastInput] = useState(null);
  const [lastInputType, setLastInputType] = useState(null);

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
    
    // Save the last submitted input and type
    setLastInput(input);
    setLastInputType(inputType);
    
    // Detect mood based on input
    const detectedMood = await detectMood(input, inputType);
    setCurrentMood(detectedMood);
    
    setIsLoading(false);
  };
  
  const handleReset = () => {
    setCurrentMood(null);
    setLastInput(null);
    setLastInputType('emoji'); // Default to emoji mode when resetting
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Main application content
  const AppContent = () => {
    // We now show the banner everywhere, not just in local environments
    return (
      <div className="App">
        <div className="dev-banner">
          🚀 Want full access? 🎧 Shoot a message to <a href="mailto:nihalpardeshi12344@gmail.com">nihalpardeshi12344@gmail.com</a> for VIP access
        </div>
        <header className="App-header">
          <div className="logo-container">
            <img 
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
      
      <main className={`App-main ${currentMood && !isLoading ? 'with-results' : ''}`}>
        <div className="mood-input-container">
          <MoodInput 
            onMoodSubmit={handleMoodSubmission} 
            lastInput={lastInput} 
            lastInputType={lastInputType} 
            showReset={currentMood !== null && !isLoading}
            onReset={handleReset}
          />
          {isLoading && <div className="loader">Analyzing your mood...</div>}
        </div>
        
        {currentMood && !isLoading && (
          <div className="results-side">
            <div className="results-container">
              <MoodMessage mood={currentMood} />
              <PlaylistRecommendation mood={currentMood} />
            </div>
          </div>
        )}
      </main>
      
      <footer className="App-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Moodify</h3>
            <p>Moodify analyzes your mood and recommends Spotify playlists to match how you're feeling.</p>
          </div>
          
          <div className="footer-section">
            <h3>Connect</h3>
            <ul className="footer-links">
              <li>
                <a href="mailto:nihalpardeshi12344@gmail.com">
                  ✉️ nihalpardeshi12344@gmail.com
                </a>
              </li>
              <li>
                <a href="https://github.com/NihaallX/moodify" target="_blank" rel="noopener noreferrer">
                  🔗 GitHub Repository
                </a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li>
                <a href="https://developer.spotify.com/documentation/" target="_blank" rel="noopener noreferrer">
                  🎵 Spotify API
                </a>
              </li>
              <li>
                <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">
                  ⚛️ React
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Moodify</p>
          <p className="made-with-love">Made with ❤️ by Nihal</p>
        </div>
      </footer>
    </div>
    );
  };
  
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
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
