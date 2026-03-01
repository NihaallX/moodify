import React, { useState, useEffect } from 'react';
import './SongRecommendation.css';
import SongCard from './SongCard';
import spotifyService from '../services/spotifyService';

/**
 * SongRecommendation
 * Fetches individual tracks from the Spotify Recommendations API based on
 * detected mood + audio-feature seeds (valence, energy, etc.), then renders
 * a grid of <SongCard> components.
 */
function SongRecommendation({ mood }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Friendly display name for the mood
  const moodLabel = mood
    ? mood.charAt(0).toUpperCase() + mood.slice(1)
    : '';

  useEffect(() => {
    if (!mood) return;

    const fetchSongs = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await spotifyService.getSongsByMood(mood, 8);
        setTracks(results);
      } catch (err) {
        console.error('SongRecommendation: error fetching songs', err);
        setError('Could not load songs. Showing suggestions instead.');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [mood]);

  /**
   * Normalise a raw Spotify track or mock track into a consistent shape
   * that SongCard expects.
   */
  const normaliseTrack = (raw) => ({
    id: raw.id || `track-${Math.random().toString(36).slice(2)}`,
    name: raw.name || 'Unknown Track',
    artists: raw.artists || [{ name: 'Unknown Artist' }],
    album: {
      name: raw.album?.name || '',
      images: raw.album?.images || []
    },
    preview_url: raw.preview_url || null,
    external_urls: {
      spotify: raw.external_urls?.spotify || 'https://open.spotify.com'
    }
  });

  const displayTracks = tracks.map(normaliseTrack);

  return (
    <div className="song-recommendation">
      <h2>
        Songs for a{' '}
        <span className="mood-highlight">{moodLabel}</span> Mood
      </h2>

      {loading && (
        <div className="songs-loading">
          <div className="loading-spinner" />
          <p>Finding the perfect songs for you…</p>
        </div>
      )}

      {error && !loading && (
        <p className="songs-error">{error}</p>
      )}

      {!loading && displayTracks.length === 0 && (
        <p className="songs-error">No songs found for this mood. Try another!</p>
      )}

      {/* Song grid */}
      <div className="songs-grid">
        {displayTracks.map(track => (
          <SongCard key={track.id} track={track} />
        ))}
      </div>

      <div className="spotify-note">
        <p>
          <small>
            {spotifyService.isLoggedIn()
              ? 'Personalised picks powered by Spotify · Click any card to open the track.'
              : 'Connect with Spotify for personalised recommendations!'}
          </small>
        </p>
      </div>
    </div>
  );
}

export default SongRecommendation;
