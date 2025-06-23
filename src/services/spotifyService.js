/**
 * Spotify API Service
 * 
 * Handles Spotify API integration using PKCE authentication flow:
 * - Authentication with Spotify
 * - Fetching user data (top tracks, recently played, liked songs)
 * - Getting mood-based recommendations
 */

import SpotifyWebApi from 'spotify-web-api-js';
import { generatePKCECodes, generateRandomState, getStoredCodeVerifier } from '../utils/authUtils';

// Create a Spotify API instance
const spotifyApi = new SpotifyWebApi();

// Spotify API configuration
const SPOTIFY_API_CONFIG = {
  clientId: 'da07c52d47084b189847adc9b915a3f5', // Your client ID from Spotify Developer Dashboard  // Use HTTPS redirect URI for both production and development to avoid insecure URI warnings
  // Include trailing slash to match exactly what's in the Spotify Developer Dashboard
  redirectUri: 'https://nihaallx.github.io/moodify/',
  // For development testing, you can manually set this to an allowed URI from Spotify Dashboard
  // For example: 'https://localhost:3000/callback' (if you set up HTTPS locally)
  scopes: [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-top-read',
    'user-read-recently-played',
    'user-library-read'
  ]
};

/**
 * Initiates Spotify authorization using PKCE flow
 * @returns {Promise<void>}
 */
const authorize = async () => {
  try {
    console.log('Starting Spotify authorization process...');
    
    // Show a loading indicator
    const body = document.querySelector('body');
    const loadingEl = document.createElement('div');
    loadingEl.className = 'global-loading';
    loadingEl.innerHTML = `
      <div class="loading-spinner"></div>
      <div>Connecting to Spotify...</div>
    `;
    loadingEl.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      color: white;
      font-size: 16px;
    `;
    body.appendChild(loadingEl);
    
    // Clear any existing authentication data to prevent conflicts
    try {
      localStorage.removeItem('spotify_code_verifier');
      localStorage.removeItem('spotify_code_verifier_timestamp');
      localStorage.removeItem('spotify_auth_state');
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
      localStorage.removeItem('spotify_token_expires_at');
      console.log('Cleared existing authentication data');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
    
    // Generate state for security first (synchronous)
    const state = generateRandomState(16);
    try {
      localStorage.setItem('spotify_auth_state', state);
      console.log('Stored auth state:', state);
    } catch (e) {
      console.error('Error storing auth state:', e);
      throw new Error('Could not store authentication state');
    }
    
    // Generate PKCE codes - this is now async
    console.log('Generating PKCE codes...');
    let codeVerifier, codeChallenge;
    try {
      const result = await generatePKCECodes(true);
      codeVerifier = result.codeVerifier;
      codeChallenge = result.codeChallenge;
      
      if (!codeVerifier || !codeChallenge) {
        throw new Error('PKCE codes generation failed');
      }
      
      console.log(`Generated PKCE codes successfully. Verifier length: ${codeVerifier.length}`);
    } catch (e) {
      console.error('Error generating PKCE codes:', e);
      throw new Error('Failed to generate security codes for authentication');
    }
    
    // Build authorization URL
    console.log('Building authorization URL...');
    try {
      const authUrl = new URL('https://accounts.spotify.com/authorize');
      
      // Add required parameters
      authUrl.searchParams.append('client_id', SPOTIFY_API_CONFIG.clientId);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', SPOTIFY_API_CONFIG.redirectUri);
      authUrl.searchParams.append('state', state);
      authUrl.searchParams.append('code_challenge_method', 'S256');
      authUrl.searchParams.append('code_challenge', codeChallenge);
      authUrl.searchParams.append('scope', SPOTIFY_API_CONFIG.scopes.join(' '));
      
      console.log('Authorization URL built, redirecting to Spotify...');
      
      // Redirect to Spotify authorization page
      window.location.href = authUrl.toString();
    } catch (e) {
      console.error('Error building authorization URL:', e);
      throw new Error('Failed to create Spotify authorization URL');
    }
  } catch (error) {
    console.error('Spotify authorization failed:', error);
    
    // Remove loading indicator if it exists
    const loadingEl = document.querySelector('.global-loading');
    if (loadingEl) {
      loadingEl.remove();
    }
    
    // Show error message to user
    alert('Failed to connect to Spotify: ' + (error.message || 'Unknown error'));
  }
};

/**
 * Exchanges authorization code for access tokens
 * @param {string} code - The authorization code from callback
 * @returns {Promise<Object>} Token response
 */
const handleCallback = async (code) => {
  try {
    console.log("Starting token exchange process...");
    
    if (!code) {
      console.error('No authorization code provided');
      throw new Error('Missing authorization code');
    }
    
    // Get the code verifier using our helper function
    const codeVerifier = getStoredCodeVerifier();
    
    if (!codeVerifier) {
      console.error('Code verifier missing. This could happen if:');
      console.error('1. The browser cleared localStorage during the auth flow');
      console.error('2. The user started auth in a different browser tab/window');
      console.error('3. The code verifier was never properly saved');
      throw new Error('Authentication failed: Code verifier missing. Please try authenticating again.');
    }
    
    // Log debug info
    console.log("Token exchange parameters:");
    console.log("- Client ID:", SPOTIFY_API_CONFIG.clientId);
    console.log("- Code:", code.substring(0, 5) + '...' + code.substring(code.length - 5));
    console.log("- Code Length:", code.length);
    console.log("- Redirect URI:", SPOTIFY_API_CONFIG.redirectUri);
    console.log("- Code Verifier:", codeVerifier.substring(0, 5) + '...' + codeVerifier.substring(codeVerifier.length - 5));
    console.log("- Code Verifier Length:", codeVerifier.length);
    
    // Create token request parameters
    const tokenRequestParams = {
      client_id: SPOTIFY_API_CONFIG.clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_API_CONFIG.redirectUri,
      code_verifier: codeVerifier,
    };
    
    const tokenRequest = new URLSearchParams(tokenRequestParams);
    console.log("Token request URL parameters:", tokenRequest.toString());
    
    // Exchange the code for access token
    console.log("Sending token exchange request to Spotify...");
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequest,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails;
      
      try {
        errorDetails = JSON.parse(errorText);
      } catch (e) {
        errorDetails = { error: 'unknown', error_description: errorText };
      }
      
      console.error('Token exchange failed:', response.status, errorDetails);
      throw new Error(`Token exchange failed: ${errorDetails.error_description || errorDetails.error || response.status}`);
    }

    // Parse the response to get tokens
    const tokenData = await response.json();
    
    // Save tokens and expiry time
    localStorage.setItem('spotify_access_token', tokenData.access_token);
    localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
    localStorage.setItem('spotify_token_expires_at', Date.now() + (tokenData.expires_in * 1000));
    
    // Set token for Spotify API instance
    spotifyApi.setAccessToken(tokenData.access_token);
    
    return tokenData;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

/**
 * Checks if the current token is valid
 * @returns {boolean} True if token is valid
 */
const isLoggedIn = () => {
  const accessToken = localStorage.getItem('spotify_access_token');
  const expiresAt = localStorage.getItem('spotify_token_expires_at');
  
  return accessToken && expiresAt && Date.now() < parseInt(expiresAt);
};

/**
 * Refreshes the access token
 * @returns {Promise<Object>} New token data
 */
const refreshToken = async () => {
  try {
    const refreshTokenValue = localStorage.getItem('spotify_refresh_token');
    
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshTokenValue,
        client_id: SPOTIFY_API_CONFIG.clientId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token: ' + response.status);
    }

    const tokenData = await response.json();
    
    // Update tokens and expiry time
    localStorage.setItem('spotify_access_token', tokenData.access_token);
    if (tokenData.refresh_token) {
      localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
    }
    localStorage.setItem('spotify_token_expires_at', Date.now() + (tokenData.expires_in * 1000));
    
    // Update token for Spotify API instance
    spotifyApi.setAccessToken(tokenData.access_token);
    
    return tokenData;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

/**
 * Makes an authorized API call with automatic token refresh
 * @param {Function} apiCall - Function that makes the API call
 * @returns {Promise<any>} API call result
 */
const withAuth = async (apiCall) => {
  try {
    // Check if token is valid
    if (!isLoggedIn()) {
      // Try to refresh token if available
      if (localStorage.getItem('spotify_refresh_token')) {
        await refreshToken();
      } else {
        throw new Error('Not authenticated. Please login.');
      }
    }
    
    // Set access token to use for API call
    const token = localStorage.getItem('spotify_access_token');
    spotifyApi.setAccessToken(token);
    
    // Make the API call
    return await apiCall();
  } catch (error) {
    // If token expired, refresh and try again
    if (error.status === 401) {
      await refreshToken();
      const token = localStorage.getItem('spotify_access_token');
      spotifyApi.setAccessToken(token);
      return await apiCall();
    }
    throw error;
  }
};

/**
 * Gets the current user's profile
 * @returns {Promise<Object>} User profile
 */
const getCurrentUser = () => {
  return withAuth(() => spotifyApi.getMe());
};

/**
 * Gets the user's top tracks
 * @param {string} timeRange - Time range: short_term, medium_term, or long_term
 * @param {number} limit - Number of tracks to get (default: 20)
 * @returns {Promise<Object>} Top tracks data
 */
const getUserTopTracks = (timeRange = 'medium_term', limit = 20) => {
  return withAuth(() => spotifyApi.getMyTopTracks({ time_range: timeRange, limit }));
};

/**
 * Gets the user's recently played tracks
 * @param {number} limit - Number of tracks to get (default: 20)
 * @returns {Promise<Object>} Recently played tracks
 */
const getRecentlyPlayedTracks = (limit = 20) => {
  return withAuth(() => spotifyApi.getMyRecentlyPlayedTracks({ limit }));
};

/**
 * Gets the user's saved/liked songs
 * @param {number} limit - Number of tracks to get (default: 20)
 * @returns {Promise<Object>} Saved tracks
 */
const getSavedTracks = (limit = 20) => {
  return withAuth(() => spotifyApi.getMySavedTracks({ limit }));
};

/**
 * Gets audio features for multiple tracks
 * @param {Array<string>} trackIds - Array of track IDs
 * @returns {Promise<Object>} Audio features for tracks
 */
const getAudioFeatures = (trackIds) => {
  return withAuth(() => spotifyApi.getAudioFeaturesForTracks(trackIds));
};

/**
 * Maps moods to audio feature ranges for recommendations
 * @param {string} mood - The detected mood
 * @returns {Object} Audio feature ranges
 */
const getMoodAudioFeatures = (mood) => {
  // Map moods to Spotify audio features
  // Valence: Musical positiveness (0.0 to 1.0)
  // Energy: Intensity and activity (0.0 to 1.0)
  // Tempo: Beats per minute
  // Danceability: How suitable for dancing (0.0 to 1.0)
  
  const moodMap = {
    happy: {
      min_valence: 0.7,
      target_energy: 0.8,
      target_danceability: 0.7
    },
    sad: {
      max_valence: 0.4,
      max_energy: 0.5,
      target_mode: 0 // Minor mode
    },
    energetic: {
      min_energy: 0.8,
      min_tempo: 120,
      target_danceability: 0.7
    },
    calm: {
      max_energy: 0.4,
      max_loudness: -8,
      target_tempo: 90
    },
    anxious: {
      target_valence: 0.3,
      min_acousticness: 0.6,
      max_energy: 0.5
    }
  };
  
  // Return the features for the requested mood or a default
  return moodMap[mood.toLowerCase()] || moodMap.happy;
};

/**
 * Fetches playlists for a given mood from Spotify
 * @param {string} mood - The detected mood
 * @returns {Promise<Array>} Array of playlist objects
 */
const getPlaylistsByMood = async (mood) => {
  try {
    // Normalize the mood to lowercase
    const normalizedMood = mood.toLowerCase();
    console.log(`Fetching playlists for mood: ${normalizedMood}`);
    
    if (!isLoggedIn()) {
      console.log('User not authenticated, using mock playlists');
      return getMockPlaylistsByMood(normalizedMood);
    }
    
    return withAuth(async () => {
      try {
        // Search for playlists related to the mood
        console.log(`Searching Spotify for playlists with query: ${normalizedMood}`);
        const response = await spotifyApi.searchPlaylists(normalizedMood, { limit: 10 });
        
        if (response && response.playlists && response.playlists.items && response.playlists.items.length > 0) {
          console.log(`Found ${response.playlists.items.length} playlists from Spotify`);
          return response.playlists.items;
        }
        
        // Fall back to mock data if no playlists found
        console.log('No playlists found from Spotify API, using mock data');
        return getMockPlaylistsByMood(normalizedMood);
      } catch (apiError) {
        console.error('Spotify API error:', apiError);
        return getMockPlaylistsByMood(normalizedMood);
      }
    });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return getMockPlaylistsByMood(mood.toLowerCase());
  }
};

/**
 * Gets mock playlists for a given mood when not authenticated or API fails
 * @param {string} mood - The detected mood
 * @returns {Array} Array of playlist objects
 */
const getMockPlaylistsByMood = (mood) => {
  // Ensure mood is normalized to lowercase
  const normalizedMood = mood.toLowerCase();
  console.log(`Getting mock playlists for mood: ${normalizedMood}`);
  
  // Mock data for playlists - fallback when not authenticated or API fails
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

  // Return the mock playlists for the mood or a default
  const result = mockPlaylists[normalizedMood] || defaultPlaylists;
  console.log(`Returning ${result.length} mock playlist(s) for mood: ${normalizedMood}`);  return result;
};

// Create a service object
const spotifyService = {
  authorize,
  handleCallback,
  isLoggedIn,
  refreshToken,
  getCurrentUser,
  getUserTopTracks,
  getRecentlyPlayedTracks,
  getSavedTracks,
  getAudioFeatures,
  getMoodAudioFeatures, // Export this function to use in future features
  getPlaylistsByMood,
  SPOTIFY_API_CONFIG
};

export default spotifyService;
