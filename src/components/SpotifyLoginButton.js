import React, { useState } from 'react';
import spotifyService from '../services/spotifyService';
import './SpotifyLoginButton.css';

function SpotifyLoginButton() {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleLogin = async () => {
    try {
      // Prevent multiple clicks
      if (isConnecting) return;
      
      setIsConnecting(true);
      console.log('Starting Spotify login process...');
      await spotifyService.authorize();
    } catch (error) {
      console.error('Login error:', error);
      setIsConnecting(false);
      alert('Failed to connect to Spotify. Please try again.');
    }
  };
  
  return (
    <button 
      className={`spotify-login-button ${isConnecting ? 'connecting' : ''}`} 
      onClick={handleLogin}
      disabled={isConnecting}
    >
      <img 
        src={`${process.env.PUBLIC_URL}/images/spotify-logo.png`} 
        alt="Spotify" 
        className="spotify-icon" 
      />
      {isConnecting ? 'Connecting...' : 'Connect with Spotify'}
    </button>
  );
}

export default SpotifyLoginButton;
