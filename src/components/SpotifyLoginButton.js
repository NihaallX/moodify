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
      <svg 
        className="spotify-icon" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.62.62 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 11-.277-1.215c3.809-.87 7.076-.496 9.712 1.115a.623.623 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.13-9.965-1.166a.779.779 0 01-.968-.519.781.781 0 01.52-.968c3.632-1.102 8.147-.568 11.234 1.324a.779.779 0 01.251 1.072zm.105-2.835c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.866 13.115 1.338a.936.936 0 01-.954 1.608z" fill="currentColor"/>
      </svg>
      {isConnecting ? (
        <>
          <span className="connecting-text">Connecting</span>
          <span className="dot-animation">.</span>
          <span className="dot-animation">.</span>
          <span className="dot-animation">.</span>
        </>
      ) : (
        'Connect with Spotify'
      )}
    </button>
  );
}

export default SpotifyLoginButton;
