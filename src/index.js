import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// During local development Spotify only accepts http://127.0.0.1 as a redirect
// URI (not http://localhost). Silently bounce the browser over so the PKCE
// code_verifier and the Spotify callback always share the same origin.
if (window.location.hostname === 'localhost') {
  window.location.replace(window.location.href.replace('localhost', '127.0.0.1'));
} else {
  // Strip the ?launch param from the URL bar (used by landing page redirect)
  if (window.location.search.includes('launch')) {
    window.history.replaceState({}, '', window.location.pathname);
  }
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
