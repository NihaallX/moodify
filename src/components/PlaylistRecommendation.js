import React, { useState, useEffect } from 'react';
import './PlaylistRecommendation.css';
import PlaylistCard from './PlaylistCard';
import PlaylistFeedback from './PlaylistFeedback';
import spotifyService from '../services/spotifyService';

function PlaylistRecommendation({ mood }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleFeedbackSubmit = (feedbackType, comment) => {
    console.log(`Playlist feedback: ${feedbackType} for mood: ${mood}`);
    if (comment) {
      console.log(`User comment: ${comment}`);
    }
    // Could add analytics tracking here in the future
  };
  
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const fetchedPlaylists = await spotifyService.getPlaylistsByMood(mood);
        setPlaylists(fetchedPlaylists);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setError('Failed to load playlists. Using fallback data.');
        setLoading(false);
      }
    };
    
    fetchPlaylists();
  }, [mood]);
  
  // Fallback mock data for playlists - in case API fails or user is not authenticated
  const mockPlaylists = {
    anxious: [
      {
        id: 'anx1',
        name: 'Calm Anxiety',
        description: 'Soothing sounds to ease your mind',
        image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX1trt8PJ5KJk'
      },
      {
        id: 'anx2',
        name: 'Anxiety Relief',
        description: 'Music to help you breathe and relax',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWUMIrOvDVsqO'
      }
    ],
    calm: [
      {
        id: 'calm1',
        name: 'Peaceful Piano',
        description: 'Relax and indulge with beautiful piano pieces',
        image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO'
      },
      {
        id: 'calm2',
        name: 'Calm Vibes',
        description: 'Chill and relaxing sounds',
        image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX1s9knjP51Oa'
      }
    ],
    happy: [
      {
        id: 'happy1',
        name: 'Happy Hits!',
        description: 'Hits to boost your mood and make you feel happy',
        image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC'
      },
      {
        id: 'happy2',
        name: 'Feel Good Piano',        
        description: 'Positive piano music to brighten your day',
        image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX0jgyAiPl8AJ'
      }
    ],
    sad: [
      {
        id: 'sad1',
        name: 'Sad Songs',
        description: 'Beautiful songs to break your heart...',
        image: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1'
      },
      {
        id: 'sad2',
        name: 'Down In The Dumps',
        description: 'For when you need to embrace the sadness',
        image: 'https://images.unsplash.com/photo-1609942072337-c3370e0bc888?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634'
      }
    ],
    energetic: [
      {
        id: 'energy1',
        name: 'Beast Mode',
        description: 'Get your beast mode on!',
        image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP'
      },
      {
        id: 'energy2',
        name: 'Energy Booster: Rock',
        description: 'Feel-good rock to get your energy levels up!',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWZixSclZdoFE'
      }
    ],
    study: [
      {
        id: 'study1',
        name: 'Lo-Fi Beats',
        description: 'Beats to relax/study to',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn'
      },
      {
        id: 'study2',
        name: 'Instrumental Study',
        description: 'Focus with soft study music in the background.',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX9sIqqvKsjG8'
      }
    ],
    soothing: [
      {
        id: 'soothe1',
        name: 'Sleep',
        description: 'Gentle ambient sounds to help you fall asleep',
        image: 'https://images.unsplash.com/photo-1455203983296-50e1d30b5087?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp'
      },
      {
        id: 'soothe2',
        name: 'Ambient Relaxation',
        description: 'Drift away with enthralling soundscapes',
        image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY'
      }
    ],
    angry: [
      {
        id: 'angry1',
        name: 'Anger Management',
        description: 'Channel your emotions with these intense tracks',
        image: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1EIgNZCaOGb0Fi'
      },
      {
        id: 'angry2',
        name: 'Rock Classics',
        description: 'Rock legends & epic songs that continue to inspire generations',
        image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U'
      }
    ],
    focused: [
      {
        id: 'focus1',
        name: 'Deep Focus',
        description: 'Keep calm and focus with ambient and post-rock music.',
        image: 'https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ'
      },
      {
        id: 'focus2',
        name: 'Focus Flow',
        description: 'Uptempo instrumental hip hop beats',
        image: 'https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWZZbwlv3Vmtr'
      }
    ]
  };
  
  // Default playlists if mood doesn't match any category
  const defaultPlaylists = [
    {
      id: 'default1',
      name: 'Today\'s Top Hits',
      description: 'The most popular tracks right now',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'
    },
    {
      id: 'default2',
      name: 'Chill Hits',
      description: 'Kick back to the best new and recent chill hits',
      image: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6'
    }
  ];  // Process playlists to ensure all required fields are present
  const processPlaylists = (playlistArray) => {
    if (!playlistArray || !Array.isArray(playlistArray)) return [];
    
    return playlistArray
      .filter(playlist => playlist && playlist !== null) // Filter out null/undefined playlists
      .map(playlist => ({
        id: playlist.id || `fallback-${Math.random().toString(36).substring(2, 10)}`, // Generate ID if missing
        name: playlist.name || 'Unknown Playlist',
        description: playlist.description || 'No description available',
        image: playlist.images && playlist.images[0]?.url 
          ? playlist.images[0].url
          : playlist.image || 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80', // Fallback image
        url: playlist.external_urls?.spotify || playlist.url || 'https://open.spotify.com'
      }));
  };
  
  // Use playlists from API or fallback to mock data if needed
  const rawDisplayPlaylists = loading 
    ? [] 
    : (playlists && playlists.length > 0)
      ? playlists
      : mockPlaylists[mood.toLowerCase()] || defaultPlaylists;
  
  // Process playlists to ensure all have required fields
  const displayPlaylists = processPlaylists(rawDisplayPlaylists);

  return (
    <div className="playlist-recommendation">
      <h2>Recommended Playlists for You</h2>
      
      {loading && (
        <div className="playlist-loading">
          <div className="loader"></div>
          <p>Finding the perfect playlists for your mood...</p>
        </div>
      )}
      
      {error && (
        <div className="playlist-error">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && displayPlaylists.length === 0 && (
        <div className="playlist-error">
          <p>No playlists found for this mood. Try another mood!</p>
        </div>
      )}
      
      <div className="playlists-container">
        {displayPlaylists.map(playlist => (
          <PlaylistCard 
            key={playlist.id} 
            playlist={playlist}
          />
        ))}
      </div>
      
      {/* Add feedback component after playlists */}
      {!loading && displayPlaylists.length > 0 && (
        <PlaylistFeedback 
          mood={mood}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      )}
      
      {spotifyService.isLoggedIn() ? (
        <div className="spotify-note">
          <p>
            <small>
              Powered by Spotify. Click any playlist to open it in Spotify.
            </small>
          </p>
        </div>
      ) : (
        <div className="spotify-note">
          <p>
            <small>
              Connect with Spotify for personalized recommendations!
            </small>
          </p>
        </div>
      )}
    </div>
  );
}

export default PlaylistRecommendation;
