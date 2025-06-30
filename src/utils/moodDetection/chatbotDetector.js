/**
 * Chatbot-based Mood Detection
 * Uses Hartmann's emotion classification model via Hugging Face API
 */

import { MOOD_CATEGORIES } from './constants';

/**
 * Call Hartmann AI API via Hugging Face Space for mood analysis
 * @param {string} text - User's chat message
 * @returns {Promise<Object|null>} API response or null on failure
 */
const callHartmannAI = async (text) => {
  const apiUrl = 'https://huggingface.co/spaces/Leofrmamzn/moodify-mood-detection/api/predict';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
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
    
    // Parse the JSON response from Hartmann model
    if (result && result.data && result.data[0]) {
      const moodData = JSON.parse(result.data[0]);
      
      if (moodData && moodData.mood) {
        return {
          success: true,
          mood: moodData.mood.toLowerCase(),
          confidence: moodData.confidence || 0.8,
          detectedEmotion: moodData.detected_emotion || 'unknown'
        };
      }
    }
    
    throw new Error('Invalid response format from Hartmann AI');
  } catch (error) {
    console.error('Error calling Hartmann AI:', error);
    return null;
  }
};

/**
 * Simple fallback mood detection for offline/error scenarios
 * @param {string} text - User input text
 * @returns {string} Detected mood category
 */
const detectMoodFallback = (text) => {
  if (!text || typeof text !== 'string') {
    return MOOD_CATEGORIES.HAPPY;
  }

  const lowercaseText = text.toLowerCase();
  
  // Basic keyword matching as fallback
  const simpleKeywords = {
    [MOOD_CATEGORIES.HAPPY]: ['happy', 'joy', 'cheerful', 'excited', 'good', 'great'],
    [MOOD_CATEGORIES.SAD]: ['sad', 'down', 'unhappy', 'depressed', 'upset'],
    [MOOD_CATEGORIES.ANGRY]: ['angry', 'mad', 'furious', 'annoyed', 'frustrated'],
    [MOOD_CATEGORIES.ANXIOUS]: ['anxious', 'nervous', 'worried', 'stress', 'scared'],
    [MOOD_CATEGORIES.CALM]: ['calm', 'peaceful', 'relaxed', 'serene'],
    [MOOD_CATEGORIES.ENERGETIC]: ['energetic', 'pumped', 'active', 'motivated'],
    [MOOD_CATEGORIES.STUDY]: ['study', 'focus', 'learning', 'homework'],
    [MOOD_CATEGORIES.SOOTHING]: ['tired', 'sleep', 'relax', 'comfort']
  };
  
  for (const [mood, keywords] of Object.entries(simpleKeywords)) {
    if (keywords.some(keyword => lowercaseText.includes(keyword))) {
      return mood;
    }
  }
  
  return MOOD_CATEGORIES.HAPPY; // Default fallback
};

/**
 * Main function: Detects mood from chat conversation using AI
 * @param {string} chatInput - User's message
 * @returns {Promise<string>} - Promise resolving to detected mood
 */
export const detectMoodFromChat = async (chatInput) => {
  try {
    // First, attempt to use Hartmann AI
    const aiResult = await callHartmannAI(chatInput);
    
    if (aiResult && aiResult.success && aiResult.mood) {
      console.log(`AI detected mood: ${aiResult.mood} (confidence: ${aiResult.confidence})`);
      return aiResult.mood;
    }
    
    // Fallback to simple detection if AI fails
    console.log('AI failed, using fallback detection');
    return detectMoodFallback(chatInput);
  } catch (error) {
    console.error('Error in chat mood detection:', error);
    return MOOD_CATEGORIES.HAPPY; // Safe fallback
  }
};
