/**
 * Chatbot-based Mood Detection
 * Uses advanced NLP/AI to detect mood from conversational text
 */

import { MOOD_CATEGORIES } from './constants';

// Mapping of sentiment scores to mood categories
const sentimentToMoodMap = {
  'very_negative': MOOD_CATEGORIES.SAD,
  'negative': MOOD_CATEGORIES.ANXIOUS,
  'neutral': MOOD_CATEGORIES.FOCUSED,
  'positive': MOOD_CATEGORIES.HAPPY,
  'very_positive': MOOD_CATEGORIES.ENERGETIC
};

// Advanced keywords for better contextual matching
const moodKeywords = {
  [MOOD_CATEGORIES.ANXIOUS]: [
    'anxious', 'nervous', 'worried', 'stress', 'stressed', 'panic', 'fear', 'scared',
    'uneasy', 'apprehensive', 'jittery', 'tense', 'frightened', 'concerned',
    'anxiety', 'uncertainty', 'dread', 'agitated', 'restless', 'insecure'
  ],
  [MOOD_CATEGORIES.CALM]: [
    'calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'content', 'ease', 'meditation',
    'quiet', 'still', 'composed', 'collected', 'untroubled', 'placid', 'zen',
    'steady', 'mellow', 'cool', 'unruffled', 'stable', 'balanced'
  ],
  [MOOD_CATEGORIES.HAPPY]: [
    'happy', 'joy', 'cheerful', 'excited', 'glad', 'pleased', 'delighted', 'thrilled',
    'optimistic', 'elated', 'jubilant', 'ecstatic', 'upbeat', 'cheery', 'blissful',
    'gleeful', 'jolly', 'lively', 'positive', 'satisfied', 'content', 'good mood'
  ],
  [MOOD_CATEGORIES.SAD]: [
    'sad', 'down', 'unhappy', 'miserable', 'depressed', 'gloomy', 'blue', 'melancholy', 
    'upset', 'heartbroken', 'sorrowful', 'dejected', 'downcast', 'downhearted', 'grieving',
    'mournful', 'tearful', 'despondent', 'disheartened', 'troubled', 'heavy-hearted'
  ],
  [MOOD_CATEGORIES.ENERGETIC]: [
    'energy', 'energetic', 'pumped', 'active', 'vigorous', 'lively', 'dynamic', 'vibrant', 
    'workout', 'motivated', 'invigorated', 'spirited', 'enthusiastic', 'peppy', 'animated',
    'vivacious', 'exuberant', 'fired up', 'full of life', 'zestful', 'eager'
  ],
  [MOOD_CATEGORIES.STUDY]: [
    'study', 'focus', 'concentration', 'homework', 'learning', 'reading', 'exam', 'test',
    'productive', 'academic', 'intellectual', 'scholarly', 'educational', 'research',
    'analytical', 'thoughtful', 'contemplative', 'reflective', 'absorbed', 'engrossed'
  ],
  [MOOD_CATEGORIES.SOOTHING]: [
    'soothe', 'soothing', 'comfort', 'gentle', 'soft', 'relax', 'sleep', 'dream', 'cozy',
    'comforting', 'restful', 'calming', 'healing', 'therapeutic', 'pacifying',
    'lulling', 'consoling', 'reassuring', 'nurturing', 'warm', 'secure'
  ],
  [MOOD_CATEGORIES.ANGRY]: [
    'angry', 'mad', 'furious', 'rage', 'annoyed', 'irritated', 'frustrated', 'upset', 'hate',
    'irate', 'enraged', 'infuriated', 'outraged', 'livid', 'seething', 'incensed', 
    'indignant', 'vexed', 'cross', 'bitter', 'heated', 'hostile'
  ],
  [MOOD_CATEGORIES.FOCUSED]: [
    'focused', 'determined', 'resolute', 'committed', 'attentive', 'dedicated', 'concentrate',
    'mindful', 'intent', 'diligent', 'steadfast', 'precise', 'alert', 'sharp',
    'disciplined', 'purposeful', 'driven', 'single-minded', 'unwavering', 'persistent'
  ]
};

/**
 * Basic local mood detection as fallback
 * @param {string} text - User input text
 * @returns {string} Detected mood category
 */
const detectMoodLocally = (text) => {
  if (!text || typeof text !== 'string') {
    return MOOD_CATEGORIES.HAPPY; // Default fallback
  }

  const lowercaseText = text.toLowerCase();
  
  let bestMatch = null;
  let highestMatchCount = 0;
  
  Object.entries(moodKeywords).forEach(([mood, keywords]) => {
    let matchCount = 0;
    
    keywords.forEach(keyword => {
      if (lowercaseText.includes(keyword)) {
        matchCount++;
      }
    });
    
    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      bestMatch = mood;
    }
  });
  
  return bestMatch || MOOD_CATEGORIES.HAPPY;
};

/**
 * Call Mistral AI API via Hugging Face Space for mood analysis
 * @param {string} text - User's chat message
 * @returns {Promise<Object|null>} API response or null on failure
 */
const callAiApi = async (text) => {
  // URL of your Hugging Face Space API endpoint
  // Replace with your actual deployed space URL
  const apiUrl = 'https://yourusername-moodify-mood-detection.hf.space/api/predict';
  
  try {
    // Set a timeout to prevent hanging if the API is slow
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [text]
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API returned status code ${response.status}`);
    }
    
    const result = await response.json();
    
    // Parse the JSON string from the API response
    if (result && result.data && result.data[0]) {
      const moodData = JSON.parse(result.data[0]);
      
      // Check if we received a valid mood
      if (moodData && moodData.mood) {
        return {
          success: true,
          dominantEmotions: moodData.mood.toLowerCase(),
          confidence: 0.9
        };
      }
    }
    
    throw new Error('Invalid response format from API');
  } catch (error) {
    console.error('Error calling Mood Detection API:', error);
    return null;
  }
};

/**
 * Detects mood from chat conversation
 * @param {string} chatInput - User's message
 * @returns {Promise<string>} - Promise resolving to detected mood
 */
export const detectMoodFromChat = async (chatInput) => {
  try {
    // First, attempt to use the AI API
    const aiResult = await callAiApi(chatInput);
    
    if (aiResult && aiResult.success) {
      // If the API returned "dominant emotions", use those
      if (aiResult.dominantEmotions) {
        return aiResult.dominantEmotions;
      }
      
      // Otherwise, map sentiment to mood
      if (aiResult.sentiment && sentimentToMoodMap[aiResult.sentiment]) {
        return sentimentToMoodMap[aiResult.sentiment];
      }
    }
    
    // Fallback to local detection if API failed
    return detectMoodLocally(chatInput);
  } catch (error) {
    console.error('Error in chat mood detection:', error);
    return MOOD_CATEGORIES.HAPPY; // Safe fallback
  }
};
