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
 * Call external AI API for sentiment and mood analysis
 * @param {string} text - User's chat message
 * @returns {Promise<Object|null>} API response or null on failure
 */
const callAiApi = async (text) => {
  // This is where you would integrate with an external API
  // For example, OpenAI, Google Cloud NLP, or Azure Text Analytics

  // For now, we'll simulate an API call with a delay
  try {
    // In a real implementation, you would make an API call like:
    // const response = await fetch('https://api.example.com/sentiment', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text })
    // });
    // return response.json();

    // Simulated API response
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple sentiment simulation based on positive/negative words
        const positiveWords = ['happy', 'good', 'great', 'excellent', 'love', 'enjoy', 'wonderful'];
        const negativeWords = ['sad', 'bad', 'awful', 'terrible', 'hate', 'dislike', 'upset'];
        
        const lowercaseText = text.toLowerCase();
        let positiveCount = 0;
        let negativeCount = 0;
        
        positiveWords.forEach(word => {
          if (lowercaseText.includes(word)) positiveCount++;
        });
        
        negativeWords.forEach(word => {
          if (lowercaseText.includes(word)) negativeCount++;
        });
        
        let sentiment;
        if (positiveCount > negativeCount + 1) {
          sentiment = 'very_positive';
        } else if (positiveCount > negativeCount) {
          sentiment = 'positive';
        } else if (negativeCount > positiveCount + 1) {
          sentiment = 'very_negative';
        } else if (negativeCount > positiveCount) {
          sentiment = 'negative';
        } else {
          sentiment = 'neutral';
        }
        
        resolve({
          success: true,
          sentiment,
          // This would come from a real AI model
          dominantEmotions: detectMoodLocally(text),
          confidence: 0.85
        });
      }, 1000);
    });
  } catch (error) {
    console.error('Error calling AI API:', error);
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
