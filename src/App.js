import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MoodInput from './components/MoodInput';
import ChatInput from './components/ChatInput';
import InputSelector from './components/InputSelector';
import MoodMessage from './components/MoodMessage';
import PlaylistRecommendation from './components/PlaylistRecommendation';
import SpotifyLoginButton from './components/SpotifyLoginButton';
import SpotifyCallback from './components/SpotifyCallback';
import UserProfile from './components/UserProfile';
import LocalDevAuth from './components/LocalDevAuth';
import ReviewForm from './components/ReviewForm';
import { detectMood } from './utils/moodDetection';
import { DETECTION_TYPES } from './utils/moodDetection/constants';
import spotifyService from './services/spotifyService';

function App() {
  const [currentMood, setCurrentMood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastInput, setLastInput] = useState(null);
  const [lastInputType, setLastInputType] = useState(null);
  const [activeInputMode, setActiveInputMode] = useState(DETECTION_TYPES.EMOJI); // Default to emoji mode
  const [showReviewForm, setShowReviewForm] = useState(false);

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

  // Initialize lastInputType if it exists in local storage
  useEffect(() => {
    const savedInputType = localStorage.getItem('moodify-input-type');
    if (savedInputType) {
      setActiveInputMode(savedInputType);
      setLastInputType(savedInputType);
    }
  }, []);

  const handleInputModeChange = (mode) => {
    setActiveInputMode(mode);
    // Save preference to local storage for persistence
    localStorage.setItem('moodify-input-type', mode);
  };

  const handleMoodSubmission = async (input, inputType) => {
    setIsLoading(true);
    
    // Save the last submitted input and type
    setLastInput(input);
    setLastInputType(inputType);
    localStorage.setItem('moodify-input-type', inputType);
    
    // Detect mood based on input
    try {
      const detectedMood = await detectMood(input, inputType);
      setCurrentMood(detectedMood);
      console.log(`Detected mood: ${detectedMood} from ${inputType} input`);
    } catch (error) {
      console.error('Error detecting mood:', error);
      // Provide user feedback about the error
      alert('Sorry, we had trouble analyzing your mood. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setCurrentMood(null);
    setLastInput(null);
    // Keep the current active input mode instead of forcing emoji mode
    setLastInputType(activeInputMode);
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
        </div>      <header className="App-header">
        <div className="logo-container">
          <img 
            src={`${process.env.PUBLIC_URL}/images/moodify-logo.png`} 
            alt="Moodify Logo" 
            className="logo" 
          />
        </div>
        <h1>Moodify</h1>
        <p className="App-subtitle">Music recommendations based on your mood</p>
        <div className="header-actions">
          {isAuthenticated ? (
            <UserProfile onLogout={handleLogout} />
          ) : (
            <SpotifyLoginButton />
          )}
          <button 
            className="review-button-header"
            onClick={() => setShowReviewForm(true)}
            title="Leave a review ✨"
          >
            ✨ Review
          </button>
        </div>
      </header>
      
      {!isAuthenticated && process.env.NODE_ENV === 'development' && (
        <LocalDevAuth />
      )}
      
      <main className={`App-main ${currentMood && !isLoading ? 'with-results' : ''}`}>
        <div className="mood-input-container">
          <InputSelector 
            activeInput={activeInputMode} 
            onInputChange={handleInputModeChange} 
          />
          
          {activeInputMode === DETECTION_TYPES.EMOJI ? (
            <MoodInput 
              onMoodSubmit={handleMoodSubmission} 
              lastInput={lastInputType === DETECTION_TYPES.EMOJI ? lastInput : 5} 
              lastInputType={DETECTION_TYPES.EMOJI}
              showReset={currentMood !== null && !isLoading}
              onReset={handleReset}
            />
          ) : (
            <ChatInput 
              onMoodSubmit={handleMoodSubmission}
              lastInput={lastInputType === DETECTION_TYPES.CHAT ? lastInput : null}
            />
          )}
          
          {isLoading && (
            <div className="loader">
              <div className="loader-animation"></div>
              <p>Analyzing your mood...</p>
            </div>
          )}
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
              <li>
                <a href="./landing.html">
                  📄 Back to Landing Page
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
      
      <ReviewForm 
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
      />
    </div>
    );
  };
  
  // Check for Spotify callback parameters in URL
  const hasCallbackParams = () => {
    // Check in query parameters - this is all we need for BrowserRouter
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('code') && urlParams.has('state');
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
