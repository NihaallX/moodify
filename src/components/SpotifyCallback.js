import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import spotifyService from '../services/spotifyService';
import { parseCallbackURL, getStoredCodeVerifier } from '../utils/authUtils';

function SpotifyCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Connecting to Spotify...');
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        let code, state;
        console.log("Processing callback at:", window.location.href);
        
        // Check if we have the code verifier first
        const codeVerifier = getStoredCodeVerifier();
        if (!codeVerifier) {
          setStatus('Authentication error: Missing code verifier. Please try again.');
          throw new Error('Missing code verifier. Please try authenticating again.');
        }
        
        // Check for parameters in the URL search string (query parameters)
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('code') && searchParams.has('state')) {
          code = searchParams.get('code');
          state = searchParams.get('state');
          console.log("Found parameters in search string");
        }
        // Check for parameters in the hash fragment (for HashRouter)
        else if (window.location.hash) {
          // First check if there's a question mark in the hash
          if (window.location.hash.includes('?')) {
            const hashParams = new URLSearchParams(window.location.hash.substring(window.location.hash.indexOf('?')));
            if (hashParams.has('code') && hashParams.has('state')) {
              code = hashParams.get('code');
              state = hashParams.get('state');
              console.log("Found parameters in hash fragment with ?");
            }
          } 
          // Also check for direct inclusion in the hash (GitHib Pages specific issue)
          else if (window.location.hash.includes('code=') && window.location.hash.includes('state=')) {
            const hashContent = window.location.hash.substring(1); // Remove the # symbol
            const params = new URLSearchParams(hashContent);
            if (params.has('code') && params.has('state')) {
              code = params.get('code');
              state = params.get('state');
              console.log("Found parameters directly in hash content");
            }
          }
        }
        
        // Final fallback to our utility function
        if (!code || !state) {
          console.log("Using parseCallbackURL as fallback");
          setStatus('Looking for authorization parameters...');
          try {
            const urlParams = parseCallbackURL(window.location.href);
            code = urlParams.get('code');
            state = urlParams.get('state');
          } catch (e) {
            console.error("Error parsing callback URL:", e);
          }
        }
        
        if (!code || !state) {
          setStatus('Authentication error: Could not find authorization parameters.');
          throw new Error('Missing authorization code or state in the callback URL');
        }
        
        // Log the received code
        console.log(`Found authorization code (length: ${code.length}) and state (${state})`);
        
        // In development mode, we might be using the manual local auth helper,
        // so we should check if the state matches what we stored, but not fail if it doesn't
        const storedState = localStorage.getItem('spotify_auth_state');
        const isDevMode = process.env.NODE_ENV === 'development';
        
        if (!isDevMode && state !== storedState) {
          setStatus('Authentication error: State mismatch.');
          throw new Error('State mismatch. Possible cross-site forgery attack.');
        }
          setStatus('Exchanging authorization code for tokens...');
        // Handle the authorization code exchange for tokens
        await spotifyService.handleCallback(code);
        
        setStatus('Authentication successful! Redirecting...');
        // Short delay to allow user to see success message
        setTimeout(() => {
          // Redirect to home after successful authentication
          navigate('/');
        }, 1000);
      } catch (error) {
        console.error('Authentication error:', error);
        setStatus(`Authentication failed: ${error.message}`);
        
        // Short delay to allow user to see error message
        setTimeout(() => {
          // Redirect to home on error
          navigate('/', { state: { error: error.message } });
        }, 3000);
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
