import React, { useState } from 'react';
import './LocalDevAuth.css';

/**
 * This component is for local development testing ONLY.
 * It helps test Spotify authentication in a development environment
 * where direct callback to localhost isn't possible due to Spotify's HTTPS requirement.
 */
function LocalDevAuth() {
  const [authCode, setAuthCode] = useState('');
  const [state, setState] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);  const handleManualCallback = () => {
    try {
      // Spotify redirects to root URL with query parameters
      const callbackUrl = `${window.location.origin}${window.location.pathname}?code=${authCode}&state=${state}`;
      
      // Redirect to the callback URL
      window.location.href = callbackUrl;
    } catch (error) {
      console.error('Error processing manual callback:', error);
      alert('Failed to process the authentication code. Please check the values and try again.');
    }
  };

  return process.env.NODE_ENV === 'development' ? (
    <div className="local-dev-auth">
      <button
        className="instructions-toggle"
        onClick={() => setShowInstructions(!showInstructions)}
      >
        {showInstructions ? 'Hide' : 'Show'} Local Development Auth Helper
      </button>
      
      {showInstructions && (
        <div className="auth-helper">
          <h3>Local Development Authentication Helper</h3>
          <p>
            Since Spotify requires HTTPS for redirect URIs, you need to manually handle
            authentication during local development:
          </p>
          <ol>
            <li>Click "Connect with Spotify" above</li>
            <li>After authorizing, you'll be redirected to the GitHub Pages version</li>
            <li>Copy the "code" parameter from the URL after "?code=" and before "&state="</li>
            <li>Copy the "state" parameter from the URL after "&state="</li>
            <li>Paste them below and click "Process Auth Code"</li>
          </ol>
          
          <div className="form-group">
            <label>Authorization Code:</label>
            <input 
              type="text" 
              value={authCode} 
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="Paste your code here"
            />
          </div>
          
          <div className="form-group">
            <label>State Value:</label>
            <input 
              type="text" 
              value={state} 
              onChange={(e) => setState(e.target.value)}
              placeholder="Paste the state here"
            />
          </div>
          
          <button 
            className="process-button"
            onClick={handleManualCallback}
            disabled={!authCode || !state}
          >
            Process Auth Code
          </button>
        </div>
      )}
    </div>
  ) : null;
}

export default LocalDevAuth;
