/**
 * Centralized Mood Detection System with Two-Layer AI Architecture
 * Layer 1: AI Emotion Detection (Hartmann model)
 * Layer 2: Contextual Refinement & Mood Routing
 */

import { detectMoodFromEmoji } from './emojiDetector';
import { detectEmotionAI } from './aiDetectorLayer1';
import { refineEmotion } from './emotionRouterLayer2';
import { generateReply } from './conversationalReply';
import { DETECTION_TYPES, MOOD_CATEGORIES } from './constants';

/**
 * Two-layer emotion detection for chat input
 * @param {string} chatInput - User's chat message
 * @returns {Promise<Object>} Complete emotion analysis result
 */
const detectMoodFromChatTwoLayer = async (chatInput) => {
  try {
    // Layer 1: AI Emotion Detection
    const aiResult = await detectEmotionAI(chatInput);
    
    // Layer 2: Contextual Refinement
    const refinedResult = refineEmotion(aiResult, chatInput);
    
    // Generate conversational reply
    const reply = generateReply(refinedResult, chatInput);
    
    console.log('Two-layer detection complete:', {
      input: chatInput,
      layer1: aiResult,
      layer2: refinedResult,
      reply: reply
    });
    
    return {
      mood: refinedResult.finalMood,
      reply: reply,
      analysis: refinedResult,
      rawAI: aiResult
    };
  } catch (error) {
    console.error('Two-layer detection failed:', error);
    
    // Fallback to simple detection
    const fallbackMood = detectMoodFallback(chatInput);
    return {
      mood: fallbackMood,
      reply: "I'll find some great music for you! 🎵",
      analysis: { finalMood: fallbackMood, reasoning: 'fallback' },
      rawAI: null
    };
  }
};

/**
 * Simple fallback mood detection
 * @param {string} text - User input text
 * @returns {string} Detected mood category
 */
const detectMoodFallback = (text) => {
  if (!text || typeof text !== 'string') {
    return MOOD_CATEGORIES.HAPPY;
  }

  const lowercaseText = text.toLowerCase();
  
  const simpleKeywords = {
    [MOOD_CATEGORIES.HAPPY]: ['happy', 'joy', 'great', 'awesome', 'excited', 'good', 'amazing'],
    [MOOD_CATEGORIES.SAD]: ['sad', 'down', 'unhappy', 'depressed', 'upset', 'blue', 'hurt'],
    [MOOD_CATEGORIES.ANGRY]: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'pissed'],
    [MOOD_CATEGORIES.ANXIOUS]: ['anxious', 'nervous', 'worried', 'stress', 'scared', 'afraid'],
    [MOOD_CATEGORIES.CALM]: ['calm', 'peaceful', 'relaxed', 'serene', 'chill', 'zen'],
    [MOOD_CATEGORIES.ENERGETIC]: ['energetic', 'pumped', 'active', 'motivated', 'hyped'],
    [MOOD_CATEGORIES.STUDY]: ['study', 'focus', 'homework', 'exam', 'learning', 'work'],
    [MOOD_CATEGORIES.SOOTHING]: ['tired', 'exhausted', 'sleepy', 'comfort', 'rest']
  };
  
  for (const [mood, keywords] of Object.entries(simpleKeywords)) {
    if (keywords.some(keyword => lowercaseText.includes(keyword))) {
      return mood;
    }
  }
  
  return MOOD_CATEGORIES.HAPPY;
};

/**
 * Factory pattern for mood detection
 * @param {any} input - Input data (varies by detection type)
 * @param {string} inputType - Type of input ('emoji', 'chat', etc)
 * @returns {Promise<string|Object>} - Promise resolving to detected mood or analysis object
 */
export const detectMood = async (input, inputType) => {
  switch (inputType) {
    case DETECTION_TYPES.EMOJI:
      return await detectMoodFromEmoji(input);
    case DETECTION_TYPES.CHAT:
      return await detectMoodFromChatTwoLayer(input);
    default:
      console.error(`Unsupported input type: ${inputType}`);
      return MOOD_CATEGORIES.HAPPY; // Default fallback mood
  }
};

// Re-export the constants for easy access from other modules
export { DETECTION_TYPES, MOOD_CATEGORIES };
