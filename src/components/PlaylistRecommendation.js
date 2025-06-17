import React from 'react';
import './PlaylistRecommendation.css';
import PlaylistCard from './PlaylistCard';
import './PlaylistCard.css';

function PlaylistRecommendation({ mood }) {  // Mock data for playlists - in a real app, these would come from Spotify API
  const playlists = {
    anxious: [
      {
        id: 'anx1',
        name: 'Calm Anxiety',
        description: 'Soothing sounds to ease your mind',
        image: '/moodify/images/playlists/calm-anxiety.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX1trt8PJ5KJk'
      },
      {
        id: 'anx2',
        name: 'Anxiety Relief',
        description: 'Music to help you breathe and relax',
        image: '/moodify/images/playlists/anxiety-relief.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWUMIrOvDVsqO'
      }
    ],
    calm: [
      {
        id: 'calm1',
        name: 'Peaceful Piano',
        description: 'Relax and indulge with beautiful piano pieces',
        image: '/moodify/images/playlists/peaceful-piano.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO'
      },
      {
        id: 'calm2',
        name: 'Calm Vibes',
        description: 'Chill and relaxing sounds',
        image: '/moodify/images/playlists/calm-vibes.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX1s9knjP51Oa'
      }
    ],
    happy: [
      {
        id: 'happy1',
        name: 'Happy Hits!',
        description: 'Hits to boost your mood and make you feel happy',
        image: '/moodify/images/playlists/happy-hits.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC'
      },
      {
        id: 'happy2',
        name: 'Feel Good Piano',
        description: 'Positive piano music to brighten your day',
        image: '/moodify/images/playlists/feel-good-piano.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX0jgyAiPl8AJ'
      }
    ],    sad: [
      {
        id: 'sad1',
        name: 'Sad Songs',
        description: 'Beautiful songs to break your heart...',
        image: '/moodify/images/playlists/sad-songs.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1'
      },
      {
        id: 'sad2',
        name: 'Down In The Dumps',
        description: 'For when you need to embrace the sadness',
        image: '/moodify/images/playlists/down-in-dumps.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634'
      }
    ],    
    energetic: [
      {
        id: 'energy1',
        name: 'Beast Mode',
        description: 'Get your beast mode on!',
        image: '/moodify/images/playlists/beast-mode.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP'
      },
      {
        id: 'energy2',
        name: 'Energy Booster: Rock',
        description: 'Feel-good rock to get your energy levels up!',
        image: '/moodify/images/playlists/energy-booster.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWZixSclZdoFE'
      }
    ],
    study: [
      {
        id: 'study1',
        name: 'Lo-Fi Beats',
        description: 'Beats to relax/study to',
        image: '/moodify/images/playlists/lofi-beats.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn'
      },
      {
        id: 'study2',
        name: 'Instrumental Study',
        description: 'Focus with soft study music in the background.',
        image: '/moodify/images/playlists/instrumental-study.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX9sIqqvKsjG8'
      }
    ],    soothing: [
      {
        id: 'soothe1',
        name: 'Sleep',
        description: 'Gentle ambient sounds to help you fall asleep',
        image: '/moodify/images/playlists/sleep.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp'
      },
      {
        id: 'soothe2',
        name: 'Ambient Relaxation',
        description: 'Drift away with enthralling soundscapes',
        image: '/moodify/images/playlists/ambient.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY'
      }
    ],
    angry: [
      {
        id: 'angry1',
        name: 'Anger Management',
        description: 'Channel your emotions with these intense tracks',
        image: '/moodify/images/playlists/anger.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1EIgNZCaOGb0Fi'
      },
      {
        id: 'angry2',
        name: 'Rock Classics',
        description: 'Rock legends & epic songs that continue to inspire generations',
        image: '/moodify/images/playlists/rock-classics.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U'
      }
    ],
    focused: [
      {
        id: 'focus1',
        name: 'Deep Focus',
        description: 'Keep calm and focus with ambient and post-rock music.',
        image: '/moodify/images/playlists/deep-focus.jpg',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ'
      },
      {
        id: 'focus2',
        name: 'Focus Flow',
        description: 'Uptempo instrumental hip hop beats',
        image: '/moodify/images/playlists/focus-flow.jpg',
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
      image: '/moodify/images/playlists/top-hits.jpg',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'
    },
    {
      id: 'default2',
      name: 'Chill Hits',
      description: 'Kick back to the best new and recent chill hits',
      image: '/moodify/images/playlists/chill-hits.jpg',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6'
    }
  ];

  // Get playlists for the mood
  const moodPlaylists = playlists[mood] || defaultPlaylists;

  return (
    <div className="playlist-recommendation">
      <h2>Recommended Playlists for You</h2>      <div className="playlists-container">
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
