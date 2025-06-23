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
  }

  return (
    user && (
      <div className="user-profile">
        <div className="user-info">
          {user.images && user.images[0] && (
            <img 
              src={user.images[0].url} 
              alt={user.display_name} 
              className="user-avatar" 
            />
          )}
          <div className="user-details">
            <h3>{user.display_name}</h3>
            <p>{user.email}</p>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    )
  );
}

export default UserProfile;
