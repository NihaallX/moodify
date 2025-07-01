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
  // Use Hugging Face Inference API directly - no CORS issues
  const apiUrl = 'https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout for model loading
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${process.env.REACT_APP_HUGGINGFACE_TOKEN || ''}`,
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
      throw new Error(`API returned status code ${response.status}: ${result.error || 'Unknown error'}`);
    }
    
    // Parse the response from Hugging Face Inference API
    // Format: [{ "label": "joy", "score": 0.9 }, { "label": "sadness", "score": 0.1 }, ...]
    if (result && Array.isArray(result) && result.length > 0) {
      // Find the emotion with highest confidence
      const topEmotion = result.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
      );
      
      console.log('Top emotion:', topEmotion);
      
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
      if (topEmotion && topEmotion.label) {
        const detectedMood = emotionToMoodMap[topEmotion.label.toLowerCase()] || "neutral";
        
        return {
          success: true,
          mood: detectedMood,
          confidence: topEmotion.score,
          detectedEmotion: topEmotion.label
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
