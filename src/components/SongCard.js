import React, { useState, useRef } from 'react';
import './SongCard.css';

/**
 * SongCard – displays a single Spotify track with:
 *   - Album artwork
 *   - Track name + artist(s)
 *   - 30-second preview player (if Spotify provides preview_url)
 *   - "Open in Spotify" link
 */
function SongCard({ track }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Helpers
  const artistNames = track.artists?.map(a => a.name).join(', ') || 'Unknown Artist';
  const albumName = track.album?.name || '';
  const albumImage = track.album?.images?.[0]?.url || null;
  const spotifyUrl = track.external_urls?.spotify || 'https://open.spotify.com';
  const previewUrl = track.preview_url || null;

  const getColorFromName = (name = '') => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 65%, 60%)`;
  };

  const fallbackStyle = {
    background: getColorFromName(track.name),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    color: '#fff',
    textAlign: 'center',
    padding: '1rem',
    fontSize: '2.5rem'
  };

  const togglePreview = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnd = () => setIsPlaying(false);

  return (
    <div className="song-card">
      {/* Album Art */}
      <div className="song-artwork">
        {!imageLoaded && !imageError && (
          <div className="art-placeholder">
            <div className="art-spinner" />
          </div>
        )}
        {imageError || !albumImage ? (
          <div style={fallbackStyle}>🎵</div>
        ) : (
          <img
            src={albumImage}
            alt={`${albumName} cover`}
            style={{ display: imageLoaded ? 'block' : 'none' }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Overlay play button if preview is available */}
        {previewUrl && (
          <button
            className={`preview-btn ${isPlaying ? 'playing' : ''}`}
            onClick={togglePreview}
            title={isPlaying ? 'Pause preview' : 'Play 30s preview'}
            aria-label={isPlaying ? 'Pause preview' : 'Play 30s preview'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        )}
      </div>

      {/* Track Info */}
      <div className="song-info">
        <h3 className="song-title" title={track.name}>{track.name}</h3>
        <p className="song-artist" title={artistNames}>{artistNames}</p>
        {albumName && (
          <p className="song-album" title={albumName}>{albumName}</p>
        )}

        <div className="song-actions">
          {previewUrl ? (
            <button
              className={`preview-text-btn ${isPlaying ? 'playing' : ''}`}
              onClick={togglePreview}
            >
              {isPlaying ? '⏸ Pause' : '▶ Preview'}
            </button>
          ) : (
            <span className="no-preview">No preview</span>
          )}
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="open-spotify-btn"
          >
            Open in Spotify
          </a>
        </div>
      </div>

      {/* Hidden audio element */}
      {previewUrl && (
        <audio
          ref={audioRef}
          src={previewUrl}
          onEnded={handleAudioEnd}
          preload="none"
        />
      )}
    </div>
  );
}

export default SongCard;
