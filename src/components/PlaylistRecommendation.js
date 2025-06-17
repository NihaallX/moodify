import React from 'react';
import './PlaylistRecommendation.css';

function PlaylistRecommendation({ mood }) {  // Mock data for playlists - in a real app, these would come from Spotify API
  const playlists = {
    anxious: [
      {
        id: 'anx1',
        name: 'Calm Anxiety',
        description: 'Soothing sounds to ease your mind',
        image: 'https://i.scdn.co/image/ab67706f00000002d900aea0a09b92eda9384cbe',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX1trt8PJ5KJk'
      },
      {
        id: 'anx2',
        name: 'Anxiety Relief',
        description: 'Music to help you breathe and relax',
        image: 'https://i.scdn.co/image/ab67706f000000025ec8c003898b36c6f73dfac7',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWUMIrOvDVsqO'
      }
    ],
    calm: [
      {
        id: 'calm1',
        name: 'Peaceful Piano',
        description: 'Relax and indulge with beautiful piano pieces',
        image: 'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO'
      },
      {
        id: 'calm2',
        name: 'Calm Vibes',
        description: 'Chill and relaxing sounds',
        image: 'https://i.scdn.co/image/ab67706f00000002d6d48b11fd3b11da654c3519',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX1s9knjP51Oa'
      }
    ],
    happy: [
      {
        id: 'happy1',
        name: 'Happy Hits!',
        description: 'Hits to boost your mood and make you feel happy',
        image: 'https://i.scdn.co/image/ab67706f00000002bd0e19e810bb4b55ab164a95',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC'
      },
      {
        id: 'happy2',
        name: 'Feel Good Piano',
        description: 'Positive piano music to brighten your day',
        image: 'https://i.scdn.co/image/ab67706f000000026e1034e2a2431d26fb0dcd2c',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX0jgyAiPl8AJ'
      }
    ],
    sad: [
      {
        id: 'sad1',
        name: 'Sad Songs',
        description: 'Beautiful songs to break your heart...',
        image: 'https://i.scdn.co/image/ab67706f000000025ec8c003898b36c6f73dfac7',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1'
      },
      {
        id: 'sad2',
        name: 'Down In The Dumps',
        description: 'For when you need to embrace the sadness',
        image: 'https://i.scdn.co/image/ab67706f000000025f0ff9251e3cfe641160dc31',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634'
      }
    ],    energetic: [
      {
        id: 'energy1',
        name: 'Beast Mode',
        description: 'Get your beast mode on!',
        image: 'https://i.scdn.co/image/ab67706f000000029249b35f23fb596b6f006a15',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP'
      },
      {
        id: 'energy2',
        name: 'Energy Booster: Rock',
        description: 'Feel-good rock to get your energy levels up!',
        image: 'https://i.scdn.co/image/ab67706f0000000299251b32401022b42b765eda',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWZixSclZdoFE'
      }
    ],
    study: [
      {
        id: 'study1',
        name: 'Lo-Fi Beats',
        description: 'Beats to relax/study to',
        image: 'https://i.scdn.co/image/ab67706f00000002863b311d4b787ed621f7e696',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn'
      },
      {
        id: 'study2',
        name: 'Instrumental Study',
        description: 'Focus with soft study music in the background.',
        image: 'https://i.scdn.co/image/ab67706f000000020f38a38658592f7c4cf0578f',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX9sIqqvKsjG8'
      }
    ],
    soothing: [
      {
        id: 'soothe1',
        name: 'Sleep',
        description: 'Gentle ambient sounds to help you fall asleep',
        image: 'https://i.scdn.co/image/ab67706f00000002b70e0223f544b1faa2e95ed0',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp'
      },
      {
        id: 'soothe2',
        name: 'Ambient Relaxation',
        description: 'Drift away with enthralling soundscapes',
        image: 'https://i.scdn.co/image/ab67706f000000023f861d7f7b24fec4ec8d8b4f',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY'
      }
    ],
    angry: [
      {
        id: 'angry1',
        name: 'Anger Management',
        description: 'Channel your emotions with these intense tracks',
        image: 'https://i.scdn.co/image/ab67706f000000022244b95f278fa7d407b0315e',
        url: 'https://open.spotify.com/playlist/37i9dQZF1EIgNZCaOGb0Fi'
      },
      {
        id: 'angry2',
        name: 'Rock Classics',
        description: 'Rock legends & epic songs that continue to inspire generations',
        image: 'https://i.scdn.co/image/ab67706f000000027f856b7e56db0d7b1c89ca68',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U'
      }
    ],
    focused: [
      {
        id: 'focus1',
        name: 'Deep Focus',
        description: 'Keep calm and focus with ambient and post-rock music.',
        image: 'https://i.scdn.co/image/ab67706f000000026e1034e2a2431d26fb0dcd2c',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ'
      },
      {
        id: 'focus2',
        name: 'Focus Flow',
        description: 'Uptempo instrumental hip hop beats',
        image: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc',
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
      image: 'https://i.scdn.co/image/ab67706f00000002acf1053e24885611363ccc85',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'
    },
    {
      id: 'default2',
      name: 'Chill Hits',
      description: 'Kick back to the best new and recent chill hits',
      image: 'https://i.scdn.co/image/ab67706f00000002b60db5d1bcdd9c4fd1ebcffe',
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
          <div key={playlist.id} className="playlist-card">
            <div className="playlist-image">
              <img src={playlist.image} alt={playlist.name} />
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
