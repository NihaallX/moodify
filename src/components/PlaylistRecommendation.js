import React from 'react';
import './PlaylistRecommendation.css';
import PlaylistCard from './PlaylistCard';

function PlaylistRecommendation({ mood }) {
  // Mock data for playlists - in a real app, these would come from Spotify API
  const playlists = {
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
  ];

  // Get playlists for the mood
  const moodPlaylists = playlists[mood] || defaultPlaylists;

  return (
    <div className="playlist-recommendation">
      <h2>Recommended Playlists for You</h2>
      <div className="playlists-container">
        {moodPlaylists.map(playlist => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
      <div className="spotify-note">
        <p>
          <small>
            Note: In the full version, you'll be able to play these directly via the Spotify API with authentication.
          </small>
        </p>
      </div>
    </div>
  );
}

export default PlaylistRecommendation;
