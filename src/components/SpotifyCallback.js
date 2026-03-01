import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import spotifyService from '../services/spotifyService';
import { getStoredCodeVerifier } from '../utils/authUtils';

function SpotifyCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Connecting to Spotify...');
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Processing callback at:', window.location.href);

        const searchParams = new URLSearchParams(window.location.search);

        // Spotify sends ?error=access_denied (or similar) when the user denies or
        // something goes wrong on their side — surface that immediately.
        if (searchParams.has('error')) {
          const spotifyError = searchParams.get('error');
          throw new Error(`Spotify returned an error: ${spotifyError}`);
        }

        const code  = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
          // Log the full URL to help debug redirect URI mismatches
          console.error('Callback URL has no code/state:', window.location.href);
          throw new Error(
            'Missing authorization code in the callback URL. ' +
            'Make sure the redirect URI in your Spotify Developer Dashboard matches: ' +
            window.location.origin + '/callback'
          );
        }

        console.log(`Found code (length: ${code.length}) and state`);

        // Verify the stored PKCE code verifier
        const codeVerifier = getStoredCodeVerifier();
        if (!codeVerifier) {
          throw new Error('Missing PKCE code verifier — please try connecting again.');
        }

        // State check (skip in dev to make localhost testing easier)
        const storedState = localStorage.getItem('spotify_auth_state');
        if (process.env.NODE_ENV !== 'development' && state !== storedState) {
          throw new Error('State mismatch — possible CSRF attack.');
        }

        setStatus('Exchanging authorization code for tokens...');
        await spotifyService.handleCallback(code);

        setStatus('Authentication successful! Redirecting...');
        setTimeout(() => navigate('/'), 1000);

      } catch (error) {
        console.error('Authentication error:', error);
        setStatus(`Authentication failed: ${error.message}`);
        setTimeout(() => navigate('/', { state: { error: error.message } }), 3000);
      }
    };

    handleCallback();
  }, [navigate]);
  return (
    <div className="spotify-callback">
      <div className="loading-container">
        <div className="loader"></div>
        <p>{status}</p>        {status.includes('Authentication successful') && (
          <p className="refresh-note">
            Taking too long? No worries!
            <br />Just <button className="refresh-button" onClick={() => window.location.href = "/"}>tap here</button> or refresh the page to vibe with your moods.
          </p>
        )}
      </div>
    </div>
  );
}

export default SpotifyCallback;
