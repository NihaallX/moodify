import React, { useState, useEffect } from 'react';
import spotifyService from '../services/spotifyService';
import './UserProfile.css';

function UserProfile({ onLogout }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await spotifyService.getCurrentUser();
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load user profile:", error);
        setError("Could not load profile. Please try logging in again.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Clear Spotify auth data
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expires_at');
    localStorage.removeItem('spotify_code_verifier');
    localStorage.removeItem('spotify_auth_state');
    
    // Call the onLogout callback to update parent component state
    if (onLogout) {
      onLogout();
    }
    
    // Force reload to clear any cached state
    window.location.reload();
  };

  if (loading) {
    return <div className="user-profile-loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="user-profile-error">{error}</div>;
  }  return (
    user && (
      <div className="user-profile" title={user.email ? `Email: ${user.email}` : ''}>
        <div className="user-info">
          {user.images && user.images[0] ? (
            <img 
              src={user.images[0].url} 
              alt={user.display_name} 
              className="user-avatar" 
              title={`${user.display_name} • ${user.email || 'No email provided'}`}
            />
          ) : (
            <div className="user-avatar-placeholder" title={`${user.display_name} • ${user.email || 'No email provided'}`}>
              {user.display_name ? user.display_name[0].toUpperCase() : '?'}
            </div>
          )}
          <span className="user-display-name">{user.display_name}</span>
          <button 
            className="logout-button" 
            onClick={handleLogout}
            title="Log out"
          >
            <svg viewBox="0 0 24 24" className="logout-icon">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
            </svg>
          </button>
        </div>
      </div>
    )
  );
}

export default UserProfile;
