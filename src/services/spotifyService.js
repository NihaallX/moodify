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

// Dynamically resolve the redirect URI based on current origin.
// This makes it work on localhost:3000 and any deployed URL without code changes.
const getRedirectUri = () => {
  // Allow explicit override via env var (useful if port differs)
  if (process.env.REACT_APP_SPOTIFY_REDIRECT_URI) {
    return process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
  }
  return `${window.location.origin}/callback`;
};

// Spotify API configuration
const SPOTIFY_API_CONFIG = {
  clientId: 'da07c52d47084b189847adc9b915a3f5',
  get redirectUri() { return getRedirectUri(); },
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
 * Maps moods to audio feature ranges + genre seeds for Spotify Recommendations API
 * @param {string} mood - The detected mood
 * @returns {Object} Audio feature ranges and genre seeds
 */
const getMoodAudioFeatures = (mood) => {
  // Spotify Audio Feature Reference:
  // valence     – musical positiveness 0.0–1.0 (sad → happy)
  // energy      – intensity/activity  0.0–1.0
  // danceability– dance suitability   0.0–1.0
  // acousticness– acoustic confidence 0.0–1.0
  // tempo       – BPM
  // mode        – 0 = minor, 1 = major

  const moodMap = {
    happy: {
      seed_genres: ['pop', 'happy', 'dance'],
      min_valence: 0.7,
      target_energy: 0.8,
      target_danceability: 0.75,
      min_mode: 1
    },
    sad: {
      seed_genres: ['sad', 'indie', 'singer-songwriter'],
      max_valence: 0.35,
      max_energy: 0.5,
      target_acousticness: 0.6,
      target_mode: 0
    },
    energetic: {
      seed_genres: ['hip-hop', 'electronic', 'hard-rock'],
      min_energy: 0.8,
      min_tempo: 120,
      target_danceability: 0.75,
      min_valence: 0.5
    },
    calm: {
      seed_genres: ['ambient', 'acoustic', 'chill'],
      max_energy: 0.4,
      target_acousticness: 0.7,
      target_tempo: 85,
      target_valence: 0.5
    },
    anxious: {
      seed_genres: ['ambient', 'sleep', 'acoustic'],
      target_valence: 0.35,
      min_acousticness: 0.55,
      max_energy: 0.45,
      max_tempo: 100
    },
    angry: {
      seed_genres: ['metal', 'hard-rock', 'punk'],
      min_energy: 0.8,
      max_valence: 0.45,
      min_tempo: 130
    },
    study: {
      seed_genres: ['study', 'ambient', 'classical'],
      max_energy: 0.5,
      target_acousticness: 0.5,
      target_instrumentalness: 0.6,
      target_tempo: 95
    },
    soothing: {
      seed_genres: ['sleep', 'ambient', 'acoustic'],
      max_energy: 0.3,
      min_acousticness: 0.5,
      target_valence: 0.4,
      max_tempo: 80
    },
    focused: {
      seed_genres: ['focus', 'electronic', 'ambient'],
      target_energy: 0.55,
      target_instrumentalness: 0.5,
      target_tempo: 105,
      target_valence: 0.55
    }
  };

  return moodMap[mood.toLowerCase()] || moodMap.happy;
};

/**
 * Mock songs per mood for unauthenticated users or API fallback.
 * 8 songs per mood, each with a stable album-art URL.
 * @param {string} mood - The detected mood
 * @returns {Array} Array of track-shaped objects
 */
const getMockSongsByMood = (mood) => {
  // Stable Unsplash photo IDs that reliably return music-themed images
  const img = (id, w = 300) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${w}&fit=crop&auto=format`;

  const mockSongs = {
    happy: [
      { id: 'h1', name: 'Happy', artists: [{ name: 'Pharrell Williams' }], album: { name: 'G I R L', images: [{ url: img('1543807535-eceef0bc6599') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH' } },
      { id: 'h2', name: 'Uptown Funk', artists: [{ name: 'Bruno Mars' }], album: { name: 'Uptown Special', images: [{ url: img('1470225620780-dba8ba36b745') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/32OlwWuMpZ964rb7uFAguL' } },
      { id: 'h3', name: "Can't Stop the Feeling!", artists: [{ name: 'Justin Timberlake' }], album: { name: 'Trolls', images: [{ url: img('1493225457124-a3eb161ffa5f') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/6JV2soYvmji58C46N4oFpD' } },
      { id: 'h4', name: 'Good as Hell', artists: [{ name: 'Lizzo' }], album: { name: 'Cuz I Love You', images: [{ url: img('1552422535-c45813c61732') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/44mGntmPCiHJuviBi77ZFNV' } },
      { id: 'h5', name: 'Blinding Lights', artists: [{ name: 'The Weeknd' }], album: { name: 'After Hours', images: [{ url: img('1511671782779-c97d3d27a1d4') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b' } },
      { id: 'h6', name: 'Levitating', artists: [{ name: 'Dua Lipa' }], album: { name: 'Future Nostalgia', images: [{ url: img('1483412033650-1015ddeb83d1') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9' } },
      { id: 'h7', name: 'Shake It Off', artists: [{ name: 'Taylor Swift' }], album: { name: '1989', images: [{ url: img('1514320291840-2e0a9bf2a9ae') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/5anCkIIye7exnQCtxqbKuL' } },
      { id: 'h8', name: 'Best Day of My Life', artists: [{ name: 'American Authors' }], album: { name: 'Oh, What a Life', images: [{ url: img('1470229722913-7c2b44eaf400') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/3Z9OJoMiNcLVDRgBrW7WpM' } },
    ],
    sad: [
      { id: 's1', name: 'Someone Like You', artists: [{ name: 'Adele' }], album: { name: '21', images: [{ url: img('1516585427167-9f4af9627e6c') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/4kflIUSoX1pb6SK8otiSoN' } },
      { id: 's2', name: 'Someone You Loved', artists: [{ name: 'Lewis Capaldi' }], album: { name: 'Divinely Uninspired', images: [{ url: img('1609942072337-c3370e0bc888') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/7qEHsqek33rTcFNT9PFndL' } },
      { id: 's3', name: 'The Night We Met', artists: [{ name: 'Lord Huron' }], album: { name: 'Strange Trails', images: [{ url: img('1455203983296-50e1d30b5087') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/0pm90H66lBJfItZIFGGPaB' } },
      { id: 's4', name: 'Let Her Go', artists: [{ name: 'Passenger' }], album: { name: 'All the Little Lights', images: [{ url: img('1508672019048-805c876b67e2') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/6tIdnjeVIziDSBVyOBVBAH' } },
      { id: 's5', name: 'Skinny Love', artists: [{ name: 'Bon Iver' }], album: { name: 'For Emma, Forever Ago', images: [{ url: img('1469474968028-56623f02e42e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/4vQIuKbXaGAjQ1IIPZ2tWu' } },
      { id: 's6', name: 'Liability', artists: [{ name: 'Lorde' }], album: { name: 'Melodrama', images: [{ url: img('1520523839897-bd0b52f945a0') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/4hOtWLpxTAqkCpRKBEHGrS' } },
      { id: 's7', name: 'Breathin', artists: [{ name: 'Ariana Grande' }], album: { name: 'Thank U Next', images: [{ url: img('1528715471579-d1bcf0ba5e83') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/6KCxkFAyeU9LJGcETFAF8Y' } },
      { id: 's8', name: 'Supercut', artists: [{ name: 'Lorde' }], album: { name: 'Melodrama', images: [{ url: img('1486739985386-d4fae04ca6f7') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/4aMzCmRBNDMSJiJEBEFkIq' } },
    ],
    energetic: [
      { id: 'e1', name: 'Eye of the Tiger', artists: [{ name: 'Survivor' }], album: { name: 'Eye of the Tiger', images: [{ url: img('1574680178050-55c6a6a96e0a') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/2HHtWyy5CgaQbC7XSoOb0e' } },
      { id: 'e2', name: 'Lose Yourself', artists: [{ name: 'Eminem' }], album: { name: '8 Mile', images: [{ url: img('1511671782779-c97d3d27a1d4') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/5Z01UMMf7V1o0MzF86s6WJ' } },
      { id: 'e3', name: 'SICKO MODE', artists: [{ name: 'Travis Scott' }], album: { name: 'Astroworld', images: [{ url: img('1498038432885-c6f3f1b912ee') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/2xLMifQCjDGFmkHkpNLD9h' } },
      { id: 'e4', name: 'Power', artists: [{ name: 'Kanye West' }], album: { name: 'MBDTF', images: [{ url: img('1519389950473-47ba0277781c') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/5O0Jif7vb0o6lj7AibUzVd' } },
      { id: 'e5', name: 'Can\'t Hold Us', artists: [{ name: 'Macklemore & Ryan Lewis' }], album: { name: 'The Heist', images: [{ url: img('1470229722913-7c2b44eaf400') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/3bidbhpOYeV4knp8AIu8Xn' } },
      { id: 'e6', name: 'Humble', artists: [{ name: 'Kendrick Lamar' }], album: { name: 'DAMN.', images: [{ url: img('1493225457124-a3eb161ffa5f') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/7KXjTSCq5nL1LoYtL7XAwS' } },
      { id: 'e7', name: 'Can\'t Feel My Face', artists: [{ name: 'The Weeknd' }], album: { name: 'Beauty Behind the Madness', images: [{ url: img('1470225620780-dba8ba36b745') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/6BCHc4BxsaZcOtBNBSMl4L' } },
      { id: 'e8', name: 'Thunderstruck', artists: [{ name: 'AC/DC' }], album: { name: 'The Razors Edge', images: [{ url: img('1483412033650-1015ddeb83d1') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/57bgtoPSgt236HzfBOd8kj' } },
    ],
    calm: [
      { id: 'c1', name: 'Clair de Lune', artists: [{ name: 'Claude Debussy' }], album: { name: 'Suite Bergamasque', images: [{ url: img('1520523839897-bd0b52f945a0') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/2W4aBB1MBg9bfcXYgYpyCC' } },
      { id: 'c2', name: 'Weightless', artists: [{ name: 'Marconi Union' }], album: { name: 'Weightless', images: [{ url: img('1499209974431-9dddcece7f88') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/1dNbKME3TBDS5pFaJVNSb4' } },
      { id: 'c3', name: 'River Flows in You', artists: [{ name: 'Yiruma' }], album: { name: 'First Love', images: [{ url: img('1528715471579-d1bcf0ba5e83') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/3SHsT0iOB4pMPD6GKcC5gX' } },
      { id: 'c4', name: 'Experience', artists: [{ name: 'Ludovico Einaudi' }], album: { name: 'In a Time Lapse', images: [{ url: img('1507525428034-b723cf961d3e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/1BNC8tKyP1etWVyGGlbsyv' } },
      { id: 'c5', name: 'Comptine d\'un autre été', artists: [{ name: 'Yann Tiersen' }], album: { name: 'Amélie', images: [{ url: img('1513128034602-7814ccaddd4e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/1u8c2t2Cy7UBoG4ArRcF5g' } },
      { id: 'c6', name: 'Eyes Closed', artists: [{ name: 'Hammock' }], album: { name: 'Chasing After Shadows', images: [{ url: img('1469474968028-56623f02e42e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/3gLbSmIqMPWAIBLHfJqZhJ' } },
      { id: 'c7', name: 'Re:Stacks', artists: [{ name: 'Bon Iver' }], album: { name: 'For Emma', images: [{ url: img('1515552726492-bf4965a69c3e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/1B7kFGfI3YS6yCJMp1PBY8' } },
      { id: 'c8', name: 'Holocene', artists: [{ name: 'Bon Iver' }], album: { name: 'Bon Iver', images: [{ url: img('1486739985386-d4fae04ca6f7') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/4GqhA4DqEDVbvqH1oAtWPb' } },
    ],
    anxious: [
      { id: 'ax1', name: 'Fix You', artists: [{ name: 'Coldplay' }], album: { name: 'X&Y', images: [{ url: img('1545231027-637d2f6210f8') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/7LVHVU3tWfcxj5aiPFEW4Q' } },
      { id: 'ax2', name: 'Sound of Silence', artists: [{ name: 'Simon & Garfunkel' }], album: { name: 'Wednesday Morning', images: [{ url: img('1493225457124-a3eb161ffa5f') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/5y788ya4NvwhBznoDIcXyb' } },
      { id: 'ax3', name: 'Breathe (2 AM)', artists: [{ name: 'Anna Nalick' }], album: { name: 'Wreck of the Day', images: [{ url: img('1516585427167-9f4af9627e6c') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/3xFkLzVkKqf3vWMEhlVjEr' } },
      { id: 'ax4', name: 'Let It Be', artists: [{ name: 'The Beatles' }], album: { name: 'Let It Be', images: [{ url: img('1455203983296-50e1d30b5087') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/7iN1s7xHE4ifF5povM6A48' } },
      { id: 'ax5', name: 'This Too Shall Pass', artists: [{ name: 'OK Go' }], album: { name: 'Of the Blue Colour of the Sky', images: [{ url: img('1499209974431-9dddcece7f88') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/0xXY4L7yxN7XKhU4JCKwkE' } },
      { id: 'ax6', name: 'Breathe', artists: [{ name: 'Pink Floyd' }], album: { name: 'Dark Side of the Moon', images: [{ url: img('1469474968028-56623f02e42e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/1AFoKBXRiUV8JRhPzQiSsG' } },
      { id: 'ax7', name: 'Skinny Love', artists: [{ name: 'Birdy' }], album: { name: 'Birdy', images: [{ url: img('1515552726492-bf4965a69c3e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/3BycmT2LRfMFaJriQQwYni' } },
      { id: 'ax8', name: 'Vienna', artists: [{ name: 'Billy Joel' }], album: { name: 'The Stranger', images: [{ url: img('1520523839897-bd0b52f945a0') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/0fAMSBrFfBBgWMnXMhqSzk' } },
    ],
    angry: [
      { id: 'ag1', name: 'Break Stuff', artists: [{ name: 'Limp Bizkit' }], album: { name: 'Significant Other', images: [{ url: img('1545231027-637d2f6210f8') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb' } },
      { id: 'ag2', name: 'Enter Sandman', artists: [{ name: 'Metallica' }], album: { name: 'Metallica', images: [{ url: img('1498038432885-c6f3f1b912ee') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/3MsNbTNCr2GEuQmPBvvKpC' } },
      { id: 'ag3', name: 'Killing in the Name', artists: [{ name: 'Rage Against the Machine' }], album: { name: 'RATM', images: [{ url: img('1511671782779-c97d3d27a1d4') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/59WN2psjkt1tyaxjspN8fp' } },
      { id: 'ag4', name: 'Numb', artists: [{ name: 'Linkin Park' }], album: { name: 'Meteora', images: [{ url: img('1574680178050-55c6a6a96e0a') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/3TO7bbrUKrOSPGRTB5MeCz' } },
      { id: 'ag5', name: 'Bodies', artists: [{ name: 'Drowning Pool' }], album: { name: 'Sinner', images: [{ url: img('1519389950473-47ba0277781c') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/4BjwjMjOQIIpFGDijKMxDG' } },
      { id: 'ag6', name: 'In The End', artists: [{ name: 'Linkin Park' }], album: { name: 'Hybrid Theory', images: [{ url: img('1483412033650-1015ddeb83d1') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/60a0Rd6pjrkxjPbaKzXjfq' } },
      { id: 'ag7', name: 'Bulls on Parade', artists: [{ name: 'Rage Against the Machine' }], album: { name: 'Evil Empire', images: [{ url: img('1470225620780-dba8ba36b745') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/1DIXPcTDzTj8ZMHgfgerlU' } },
      { id: 'ag8', name: 'Down with the Sickness', artists: [{ name: 'Disturbed' }], album: { name: 'The Sickness', images: [{ url: img('1470229722913-7c2b44eaf400') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/2plKKGHhPkb4P4BJQHVSRE' } },
    ],
    study: [
      { id: 'st1', name: 'Experience', artists: [{ name: 'Ludovico Einaudi' }], album: { name: 'In a Time Lapse', images: [{ url: img('1456513080510-7bf3a84b82f8') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/1BNC8tKyP1etWVyGGlbsyv' } },
      { id: 'st2', name: 'Gymnopédie No. 1', artists: [{ name: 'Erik Satie' }], album: { name: 'Gymnopédies', images: [{ url: img('1434030216411-0b793f4b4173') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/5NGtFXVpXSvwunEIGeviY3' } },
      { id: 'st3', name: 'Nuvole Bianche', artists: [{ name: 'Ludovico Einaudi' }], album: { name: 'Una Mattina', images: [{ url: img('1558021212-51b6ecfa0db9') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/1tpXaFMLwOMfGDRE7gFMnN' } },
      { id: 'st4', name: "Comptine d'un autre été", artists: [{ name: 'Yann Tiersen' }], album: { name: 'Amélie', images: [{ url: img('1513128034602-7814ccaddd4e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/1u8c2t2Cy7UBoG4ArRcF5g' } },
      { id: 'st5', name: 'Weightless', artists: [{ name: 'Marconi Union' }], album: { name: 'Weightless', images: [{ url: img('1499209974431-9dddcece7f88') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/1dNbKME3TBDS5pFaJVNSb4' } },
      { id: 'st6', name: 'Clair de Lune', artists: [{ name: 'Claude Debussy' }], album: { name: 'Suite Bergamasque', images: [{ url: img('1520523839897-bd0b52f945a0') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/2W4aBB1MBg9bfcXYgYpyCC' } },
      { id: 'st7', name: 'Time', artists: [{ name: 'Hans Zimmer' }], album: { name: 'Inception OST', images: [{ url: img('1486739985386-d4fae04ca6f7') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/6ZFbXIJkuI1dVNWvzJzown' } },
      { id: 'st8', name: 'On the Nature of Daylight', artists: [{ name: 'Max Richter' }], album: { name: 'The Blue Notebooks', images: [{ url: img('1507525428034-b723cf961d3e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/6pCsaHBSmMGqU2d8JFLZMB' } },
    ],
    soothing: [
      { id: 'so1', name: 'Sleep', artists: [{ name: 'Max Richter' }], album: { name: 'Sleep', images: [{ url: img('1455203983296-50e1d30b5087') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/0s7T8FjIYVmtFiSHqiAx9g' } },
      { id: 'so2', name: 'Watermark', artists: [{ name: 'Enya' }], album: { name: 'Watermark', images: [{ url: img('1508672019048-805c876b67e2') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/5fZoxboeHsGWYHSfaOVBgb' } },
      { id: 'so3', name: 'Pure Shores', artists: [{ name: 'All Saints' }], album: { name: 'Saints & Sinners', images: [{ url: img('1499209974431-9dddcece7f88') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/0FvvNpQO21jFKbcKN8e1hH' } },
      { id: 'so4', name: 'On the Nature of Daylight', artists: [{ name: 'Max Richter' }], album: { name: 'The Blue Notebooks', images: [{ url: img('1507525428034-b723cf961d3e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/6pCsaHBSmMGqU2d8JFLZMB' } },
      { id: 'so5', name: 'River', artists: [{ name: 'Leon Bridges' }], album: { name: 'Coming Home', images: [{ url: img('1474926122024-a0d4f1f91e3e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/3sFMnCpWzHAiClRBwReBsN' } },
      { id: 'so6', name: 'Saturn', artists: [{ name: 'Stevie Wonder' }], album: { name: "Songs in the Key of Life", images: [{ url: img('1515552726492-bf4965a69c3e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/3LvXssJBfCgCNPpSrD9oT3' } },
      { id: 'so7', name: 'Slow Dancing in a Burning Room', artists: [{ name: 'John Mayer' }], album: { name: 'Continuum', images: [{ url: img('1469474968028-56623f02e42e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/246oMhSwoPfFHjQqHxQgkh' } },
      { id: 'so8', name: 'Holocene', artists: [{ name: 'Bon Iver' }], album: { name: 'Bon Iver', images: [{ url: img('1486739985386-d4fae04ca6f7') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/4GqhA4DqEDVbvqH1oAtWPb' } },
    ],
    focused: [
      { id: 'f1', name: 'Interstellar Main Theme', artists: [{ name: 'Hans Zimmer' }], album: { name: 'Interstellar OST', images: [{ url: img('1558021212-51b6ecfa0db9') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/5kpMHsCoNXZpAOnbYXmXvg' } },
      { id: 'f2', name: 'Time', artists: [{ name: 'Hans Zimmer' }], album: { name: 'Inception OST', images: [{ url: img('1513128034602-7814ccaddd4e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/6ZFbXIJkuI1dVNWvzJzown' } },
      { id: 'f3', name: 'Strobe', artists: [{ name: 'deadmau5' }], album: { name: 'For Lack of a Better Name', images: [{ url: img('1519389950473-47ba0277781c') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/0BkDMThCsRhOphZN23OEHG' } },
      { id: 'f4', name: 'Test Drive', artists: [{ name: 'John Powell' }], album: { name: 'How to Train Your Dragon', images: [{ url: img('1493225457124-a3eb161ffa5f') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/2UVbJFaH5d9s2YpAjFrQ2o' } },
      { id: 'f5', name: 'Experience', artists: [{ name: 'Ludovico Einaudi' }], album: { name: 'In a Time Lapse', images: [{ url: img('1456513080510-7bf3a84b82f8') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/1BNC8tKyP1etWVyGGlbsyv' } },
      { id: 'f6', name: 'Intro', artists: [{ name: 'The xx' }], album: { name: 'xx', images: [{ url: img('1486739985386-d4fae04ca6f7') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/1J3mH2BbAOAjHYtxLFIVfn' } },
      { id: 'f7', name: 'Contact', artists: [{ name: 'Daft Punk' }], album: { name: 'Random Access Memories', images: [{ url: img('1470225620780-dba8ba36b745') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/0DiWol3AO6WpXZgp0goxAV' } },
      { id: 'f8', name: 'Teardrop', artists: [{ name: 'Massive Attack' }], album: { name: 'Mezzanine', images: [{ url: img('1469474968028-56623f02e42e') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/4OHq6sGRohJjpDppnIYHAD' } },
    ],
  };

  const defaultSongs = [
    { id: 'd1', name: 'Blinding Lights', artists: [{ name: 'The Weeknd' }], album: { name: 'After Hours', images: [{ url: img('1470225620780-dba8ba36b745') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b' } },
    { id: 'd2', name: 'Shape of You', artists: [{ name: 'Ed Sheeran' }], album: { name: '÷ (Divide)', images: [{ url: img('1483412033650-1015ddeb83d1') }] }, preview_url: null, external_urls: { spotify: 'https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3' } }
  ];

  return mockSongs[mood] || defaultSongs;
};

/**
 * Popular seed track IDs per mood — gives Spotify more context for recommendations
 * and produces more varied results when we use a random pick each call.
 */
const MOOD_SEED_TRACKS = {
  happy:     ['0VjIjW4GlUZAMYd2vXMi3b','463CkQjx2Zk1yXoBuierM9','60nZcImufyMA1MKQY3dcCH','32OlwWuMpZ964rb7uFAguL'],
  sad:       ['4kflIUSoX1pb6SK8otiSoN','0pm90H66lBJfItZIFGGPaB','7qEHsqek33rTcFNT9PFndL','6tIdnjeVIziDSBVyOBVBAH'],
  energetic: ['2HHtWyy5CgaQbC7XSoOb0e','5Z01UMMf7V1o0MzF86s6WJ','0gplL1WMoJ6iYaPgMCL0gX','3TO7bbrUKrOSPGRTB5MeCz'],
  calm:      ['2W4aBB1MBg9bfcXYgYpyCC','1dNbKME3TBDS5pFaJVNSb4','1BNC8tKyP1etWVyGGlbsyv','3SHsT0iOB4pMPD6GKcC5gX'],
  anxious:   ['7LVHVU3tWfcxj5aiPFEW4Q','5y788ya4NvwhBznoDIcXyb','3xFkLzVkKqf3vWMEhlVjEr','7iN1s7xHE4ifF5povM6A48'],
  angry:     ['7GhIk7Il098yCjg4BQjzvb','3MsNbTNCr2GEuQmPBvvKpC','59WN2psjkt1tyaxjspN8fp','3TO7bbrUKrOSPGRTB5MeCz'],
  study:     ['1BNC8tKyP1etWVyGGlbsyv','5NGtFXVpXSvwunEIGeviY3','1tpXaFMLwOMfGDRE7gFMnN','1u8c2t2Cy7UBoG4ArRcF5g'],
  soothing:  ['0s7T8FjIYVmtFiSHqiAx9g','5fZoxboeHsGWYHSfaOVBgb','6pCsaHBSmMGqU2d8JFLZMB','0FvvNpQO21jFKbcKN8e1hH'],
  focused:   ['5kpMHsCoNXZpAOnbYXmXvg','6ZFbXIJkuI1dVNWvzJzown','2UVbJFaH5d9s2YpAjFrQ2o','1tpXaFMLwOMfGDRE7gFMnN'],
};

/** Return a shuffled copy of an array */
const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

/**
 * Fetches individual song recommendations for a given mood from Spotify.
 * Requests a larger pool, filters out tracks with no album artwork,
 * deduplicates repeating artists, then returns the first `limit` tracks.
 * A random seed track is injected each call so results vary.
 *
 * @param {string} mood  - The detected mood
 * @param {number} limit - Number of songs to return (default: 8)
 * @returns {Promise<Array>} Array of track objects
 */
const getSongsByMood = async (mood, limit = 8) => {
  try {
    const normalizedMood = mood.toLowerCase();
    console.log(`Fetching songs for mood: ${normalizedMood}`);

    if (!isLoggedIn()) {
      console.log('User not authenticated, using mock songs');
      return getMockSongsByMood(normalizedMood);
    }

    return withAuth(async () => {
      try {
        const audioFeatures = getMoodAudioFeatures(normalizedMood);
        const { seed_genres, ...audioParams } = audioFeatures;

        // Pick one random seed track so each call produces different results
        const seedPool = MOOD_SEED_TRACKS[normalizedMood] || MOOD_SEED_TRACKS.happy;
        const randomSeedTrack = seedPool[Math.floor(Math.random() * seedPool.length)];

        // Use 2 genres + 1 track (max 5 seeds total, we use 3 to stay safe)
        const params = {
          limit: Math.min(limit * 3, 40), // fetch a larger pool, filter down
          seed_genres: seed_genres.slice(0, 2).join(','),
          seed_tracks: randomSeedTrack,
          min_popularity: 20,             // avoid truly obscure tracks
          ...audioParams
        };

        console.log(`Spotify recommendations params:`, params);
        const response = await spotifyApi.getRecommendations(params);

        if (response && response.tracks && response.tracks.length > 0) {
          // Filter to tracks that have album artwork
          const withImages = response.tracks.filter(
            t => t.album?.images?.length > 0
          );

          // Shuffle so repeated calls feel fresh, then deduplicate artists
          const shuffled = shuffleArray(withImages.length >= limit ? withImages : response.tracks);
          const seen = new Set();
          const deduped = [];
          for (const track of shuffled) {
            const artistKey = track.artists?.[0]?.name?.toLowerCase() || '';
            if (!seen.has(artistKey)) {
              seen.add(artistKey);
              deduped.push(track);
            }
            if (deduped.length >= limit) break;
          }

          // If deduplication ate too many, just pad from filtered list
          if (deduped.length < limit) {
            for (const track of shuffled) {
              if (!deduped.includes(track)) deduped.push(track);
              if (deduped.length >= limit) break;
            }
          }

          console.log(`Returning ${deduped.length} songs after filtering/dedup`);
          return deduped.slice(0, limit);
        }

        console.log('No recommendations returned, using mock songs');
        return getMockSongsByMood(normalizedMood);
      } catch (apiError) {
        console.error('Spotify recommendations API error:', apiError);
        return getMockSongsByMood(normalizedMood);
      }
    });
  } catch (error) {
    console.error('Error fetching songs by mood:', error);
    return getMockSongsByMood(mood.toLowerCase());
  }
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
  getMoodAudioFeatures,
  getPlaylistsByMood,
  getSongsByMood,       // New: individual song recommendations via audio features
  SPOTIFY_API_CONFIG
};

export default spotifyService;
