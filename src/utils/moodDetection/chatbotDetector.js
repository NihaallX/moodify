/**
 * Chatbot-based Mood Detection
 * Uses Hartmann's emotion classification model via Hugging Face API
 */

import { MOOD_CATEGORIES } from './constants';

/**
 * Call Hartmann AI API via Hugging Face Inference API (avoids CORS issues)
 * @param {string} text - User's chat message
 * @returns {Promise<Object|null>} API response or null on failure
 */
const callHartmannAI = async (text) => {
  // Check if token is available
  const token = process.env.REACT_APP_HUGGINGFACE_TOKEN;
  if (!token || token.trim() === '') {
    console.log('Hugging Face token not available, skipping AI detection');
    return null;
  }
  
  // Use Hugging Face Inference API directly - no CORS issues
  const apiUrl = 'https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout for model loading
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    const result = await response.json();
    console.log('HF Inference API raw response:', result);
    
    if (!response.ok) {
      console.log('API Error:', result);
      // Don't throw error for auth issues, just return null to use fallback
      if (response.status === 401 || response.status === 403) {
        console.log('Authentication failed, falling back to simple detection');
        return null;
      }
      throw new Error(`API returned status code ${response.status}: ${result.error || 'Unknown error'}`);
    }
    
    // Parse the response from Hugging Face Inference API
    // Handle different response formats gracefully
    console.log('Parsing AI response:', typeof result, result);
    
    let emotions = [];
    
    // Handle array response format: [{ "label": "joy", "score": 0.9 }, ...]
    if (Array.isArray(result)) {
      // Check if it's a direct array of emotions
      if (result.length > 0 && result[0].label && typeof result[0].score === 'number') {
        emotions = result;
      }
      // Handle nested array format: [[{ "label": "joy", "score": 0.9 }, ...]]
      else if (result.length > 0 && Array.isArray(result[0])) {
        emotions = result[0];
      }
    }
    // Handle object with emotions array
    else if (result && result.emotions && Array.isArray(result.emotions)) {
      emotions = result.emotions;
    }
    // Handle single emotion object
    else if (result && result.label && typeof result.score === 'number') {
      emotions = [result];
    }
    
    console.log('Parsed emotions array:', emotions);
    
    if (emotions.length > 0 && emotions[0].label) {
      // Find the emotion with highest confidence
      const topEmotion = emotions.reduce((prev, current) => {
        const prevScore = typeof prev.score === 'number' ? prev.score : 0;
        const currentScore = typeof current.score === 'number' ? current.score : 0;
        return prevScore > currentScore ? prev : current;
      });
      
      console.log('Top emotion (parsed correctly):', topEmotion);
      
      // Map AI emotion to Moodify mood categories
      const emotionToMoodMap = {
        "joy": "happy",
        "sadness": "sad", 
        "anger": "angry",
        "fear": "anxious",
        "surprise": "energetic",
        "disgust": "angry"
      };
      
      // Safe access to label property
      if (topEmotion && topEmotion.label && typeof topEmotion.label === 'string') {
        const detectedMood = emotionToMoodMap[topEmotion.label.toLowerCase()] || "happy";
        
        return {
          success: true,
          mood: detectedMood,
          confidence: topEmotion.score || 0.5,
          detectedEmotion: topEmotion.label
        };
      }
    }
    
    // If parsing fails, return a graceful fallback instead of throwing
    console.log('Could not parse AI response, using fallback');
    return null;
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
