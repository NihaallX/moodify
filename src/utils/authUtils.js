/**
 * Spotify Authentication Utilities
 * Implements PKCE (Proof Key for Code Exchange) flow
 */

import pkceChallenge from 'pkce-challenge';

/**
 * Manual PKCE code verifier generation as a fallback
 * @param {number} length - Length of code verifier (default 43-128 characters)
 * @returns {string} Generated code verifier
 */
export const generateCodeVerifier = (length = 64) => {
  // Use crypto.getRandomValues if available
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  
  // Use a crypto-secure random generator if available
  if (window.crypto && window.crypto.getRandomValues) {
    const values = new Uint8Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += charset[values[i] % charset.length];
    }
  } else {
    // Fallback to Math.random
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  }
  
  return result;
};

/**
 * Creates a base64 encoded SHA-256 hash for the code challenge
 * @param {string} verifier - Code verifier
 * @returns {Promise<string>} Base64 URL encoded code challenge
 */
export const createCodeChallenge = async (verifier) => {
  try {
    // Use the Web Crypto API for hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    
    // Base64 URL encode the hash
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (error) {
    console.error('Failed to create code challenge:', error);
    throw error;
  }
};

/**
 * Generates a code verifier and code challenge for PKCE
 * @param {boolean} storeImmediately - Whether to store the code verifier in localStorage immediately
 * @returns {Promise<Object>} Object with codeVerifier and codeChallenge
 */
export const generatePKCECodes = async (storeImmediately = true) => {
  try {
    // First try with the pkce-challenge library
    let codeVerifier, codeChallenge;
    
    try {
      const challenge = pkceChallenge();
      if (challenge && challenge.code_verifier && challenge.code_challenge) {
        codeVerifier = challenge.code_verifier;
        codeChallenge = challenge.code_challenge;
      } else {
        throw new Error('Invalid response from pkce-challenge');
      }
    } catch (pkceError) {
      console.warn('pkce-challenge library failed, falling back to manual implementation:', pkceError);
      
      // Fallback to manual implementation
      codeVerifier = generateCodeVerifier(64);
      codeChallenge = await createCodeChallenge(codeVerifier);
    }
    
    // Verify we have valid values
    if (!codeVerifier || typeof codeVerifier !== 'string') {
      throw new Error('Invalid code verifier generated');
    }
    
    // Store code verifier immediately if requested
    if (storeImmediately) {
      try {
        localStorage.setItem('spotify_code_verifier', codeVerifier);
        // Store timestamp to track when it was created
        localStorage.setItem('spotify_code_verifier_timestamp', Date.now().toString());
        console.log(`Stored code_verifier (${codeVerifier.length} chars) in localStorage`);
      } catch (e) {
        console.error('Failed to store code verifier in localStorage:', e);
      }
    }
    
    return { codeVerifier, codeChallenge };
  } catch (error) {
    console.error('Error in generatePKCECodes:', error);
    throw error;
  }
};

/**
 * Converts a string to an ArrayBuffer for cryptographic operations
 * @param {string} str - String to convert
 * @returns {ArrayBuffer} Converted ArrayBuffer
 */
export const stringToArrayBuffer = (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};

/**
 * Generates a random state string for OAuth security
 * @param {number} length - Length of the state string
 * @returns {string} Random state string
 */
export const generateRandomState = (length = 16) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
};

/**
 * Parses the URL search params from a callback URL
 * @param {string} url - Full callback URL
 * @returns {URLSearchParams} Parsed search params
 */
export const parseCallbackURL = (url) => {
  const urlObj = new URL(url);
  return new URLSearchParams(urlObj.search);
};

/**
 * Gets the stored PKCE code verifier from localStorage
 * @returns {string|null} The stored code verifier or null if not found
 */
export const getStoredCodeVerifier = () => {
  let codeVerifier;
  
  try {
    codeVerifier = localStorage.getItem('spotify_code_verifier');
    
    if (!codeVerifier) {
      console.error('No code verifier found in localStorage');
      return null;
    }
    
    // For debugging: log the length and timestamp
    const timestamp = localStorage.getItem('spotify_code_verifier_timestamp');
    const timestampStr = timestamp ? new Date(parseInt(timestamp)).toISOString() : 'unknown time';
    console.log(`Retrieved code verifier (${codeVerifier.length} chars) created at: ${timestampStr}`);
    
    return codeVerifier;
  } catch (error) {
    console.error('Error retrieving code verifier from localStorage:', error);
    return null;
  }
};
