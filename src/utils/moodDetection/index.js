/**
 * Centralized Mood Detection
 * - Emoji slider → fast local mapping
 * - Chat text   → Groq LLM (llama-3.3-70b-versatile)
 */

import { detectMoodFromEmoji } from './emojiDetector';
import { detectMoodWithGroq } from './groqDetector';
import { DETECTION_TYPES, MOOD_CATEGORIES } from './constants';

/**
 * Detect mood from any input type.
 * @param {string|number} input - Emoji slider value or chat text
 * @param {string} inputType   - 'emoji' | 'chat'
 * @returns {Promise<string | {mood: string, reply: string}>}
 *   Emoji → plain mood string
 *   Chat  → { mood, reply }
 */
export const detectMood = async (input, inputType) => {
  switch (inputType) {
    case DETECTION_TYPES.EMOJI:
      return await detectMoodFromEmoji(input);

    case DETECTION_TYPES.CHAT:
      return await detectMoodWithGroq(input);

    default:
      console.error(`Unknown input type: ${inputType}`);
      return MOOD_CATEGORIES.HAPPY;
  }
};

export { DETECTION_TYPES, MOOD_CATEGORIES };
