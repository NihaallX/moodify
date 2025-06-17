import React, { useState } from 'react';

function PlaylistCard({ playlist }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Create a background color based on playlist name for consistent fallback
  const getColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 70%)`;
  };

  // Fallback style when image fails to load
  const fallbackStyle = {
    height: '100%',
    width: '100%',
    backgroundColor: getColorFromName(playlist.name),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textAlign: 'center',
    padding: '1rem',
  };
  
  return (
    <div className="playlist-card">
      <div className="playlist-image">
        {!imageLoaded && !imageError && (
          <div className="image-loading-placeholder">
            <div className="loading-animation"></div>
          </div>
        )}
        {imageError ? (
          <div style={fallbackStyle}>
            <div>
              <div className="fallback-icon">🎵</div>
              <div>{playlist.name}</div>
            </div>
          </div>
        ) : (
          <img
            src={playlist.image}
            alt={playlist.name}
            style={{ display: imageLoaded ? 'block' : 'none' }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="playlist-info">
        <h3>{playlist.name}</h3>
        <p>{playlist.description}</p>
        <a 
          href={playlist.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="playlist-link"
        >
          Listen on Spotify
        </a>
      </div>
    </div>
  );
}

export default PlaylistCard;
