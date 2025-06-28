/**
 * Centralized Mood Detection System
 * This module integrates different mood detection strategies
 */

import { detectMoodFromEmoji } from './emojiDetector';
import { detectMoodFromChat } from './chatbotDetector';
import { DETECTION_TYPES, MOOD_CATEGORIES } from './constants';

/**
 * Factory pattern for mood detection
 * @param {any} input - Input data (varies by detection type)
 * @param {string} inputType - Type of input ('emoji', 'chat', etc)
 * @returns {Promise<string>} - Promise resolving to detected mood
 */
export const detectMood = async (input, inputType) => {
  switch (inputType) {
    case DETECTION_TYPES.EMOJI:
      return await detectMoodFromEmoji(input);
    case DETECTION_TYPES.CHAT:
      return await detectMoodFromChat(input);
    default:
      console.error(`Unsupported input type: ${inputType}`);
      return MOOD_CATEGORIES.HAPPY; // Default fallback mood
  }
};

// Re-export the constants for easy access from other modules
export { DETECTION_TYPES, MOOD_CATEGORIES };
