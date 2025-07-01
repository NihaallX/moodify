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
      // Note: Hartmann model only detects 6 basic emotions: joy, sadness, anger, fear, surprise, disgust
      const emotionToMoodMap = {
        "joy": "happy",
        "sadness": "sad", 
        "anger": "angry",
        "fear": "anxious",
        "surprise": "energetic", // Could be happy too, but energetic fits better
        "disgust": "angry" // Disgust often correlates with anger/irritation
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
  
  // Enhanced keyword matching with expanded vocabulary
  const simpleKeywords = {
    [MOOD_CATEGORIES.HAPPY]: [
      // Basic happy words
      'happy', 'joy', 'joyful', 'cheerful', 'excited', 'good', 'great', 'amazing', 'awesome', 'fantastic',
      'wonderful', 'excellent', 'brilliant', 'superb', 'delighted', 'thrilled', 'elated', 'ecstatic',
      'overjoyed', 'jubilant', 'euphoric', 'blissful', 'content', 'satisfied', 'pleased', 'glad',
      
      // Modern/slang expressions
      'fire', 'lit', 'vibing', 'blessed', 'winning', 'crushing', 'killing it', 'on top', 'pumped',
      'stoked', 'hyped', 'buzzing', 'flying high', 'on cloud nine', 'over the moon', 'living my best life',
      
      // Emotional states
      'optimistic', 'positive', 'upbeat', 'bright', 'sunny', 'radiant', 'glowing', 'beaming',
      'cheerful', 'merry', 'lively', 'spirited', 'buoyant', 'uplifted', 'energized'
    ],
    
    [MOOD_CATEGORIES.SAD]: [
      // Basic sad words
      'sad', 'down', 'unhappy', 'depressed', 'upset', 'blue', 'low', 'gloomy', 'miserable',
      'heartbroken', 'devastated', 'crushed', 'broken', 'hurt', 'pain', 'ache', 'grief',
      'sorrow', 'melancholy', 'despair', 'hopeless', 'defeated', 'discouraged', 'disappointed',
      
      // Modern expressions
      'feeling down', 'bummed out', 'down in the dumps', 'feeling blue', 'not okay', 'struggling',
      'going through it', 'having a rough time', 'not vibing', 'feeling off', 'down bad',
      
      // Emotional states
      'lonely', 'empty', 'numb', 'hollow', 'lost', 'confused', 'overwhelmed', 'drained',
      'weary', 'exhausted emotionally', 'tearful', 'crying', 'sobbing', 'weeping'
    ],
    
    [MOOD_CATEGORIES.ANGRY]: [
      // Basic angry words
      'angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated', 'pissed', 'rage',
      'enraged', 'livid', 'irate', 'outraged', 'infuriated', 'incensed', 'seething',
      'boiling', 'fuming', 'steaming', 'heated', 'agitated', 'aggravated', 'vexed',
      
      // Modern expressions
      'pissed off', 'ticked off', 'fed up', 'had enough', 'done with', 'over it', 'triggered',
      'seeing red', 'losing it', 'about to snap', 'ready to explode', 'burning up',
      
      // Intensity levels
      'slightly annoyed', 'mildly irritated', 'really angry', 'absolutely furious',
      'beyond angry', 'raging', 'volcanic', 'explosive', 'hostile', 'aggressive'
    ],
    
    [MOOD_CATEGORIES.ANXIOUS]: [
      // Basic anxious words
      'anxious', 'nervous', 'worried', 'stress', 'stressed', 'scared', 'afraid', 'fearful',
      'terrified', 'panicked', 'panic', 'anxiety', 'tension', 'uneasy', 'unsettled',
      'restless', 'jittery', 'on edge', 'wound up', 'uptight', 'tense', 'frazzled',
      
      // Physical symptoms
      'butterflies', 'racing heart', 'sweaty palms', 'shaking', 'trembling', 'nauseous',
      'sick to stomach', 'dizzy', 'lightheaded', 'breathless', 'chest tight',
      
      // Modern expressions
      'freaking out', 'losing my mind', 'going crazy', 'spiraling', 'overthinking',
      'catastrophizing', 'worst case scenario', 'what if', 'can\'t handle', 'breaking down',
      'having a meltdown', 'anxiety attack', 'panic attack', 'stress ball', 'wound tight'
    ],
    
    [MOOD_CATEGORIES.CALM]: [
      // Basic calm words
      'calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'quiet', 'still', 'centered',
      'balanced', 'composed', 'collected', 'cool', 'mellow', 'laid back', 'chill',
      'zen', 'meditative', 'mindful', 'present', 'grounded', 'stable', 'steady',
      
      // Modern expressions
      'chilling', 'chilled out', 'taking it easy', 'going with the flow', 'no worries',
      'all good', 'at peace', 'in my element', 'feeling zen', 'totally relaxed',
      
      // States of being
      'content', 'satisfied', 'at ease', 'comfortable', 'secure', 'safe', 'protected',
      'harmony', 'equilibrium', 'inner peace', 'serenity', 'tranquility'
    ],
    
    [MOOD_CATEGORIES.ENERGETIC]: [
      // Basic energetic words
      'energetic', 'pumped', 'active', 'motivated', 'driven', 'dynamic', 'vibrant',
      'lively', 'spirited', 'animated', 'enthusiastic', 'vigorous', 'powerful',
      'strong', 'charged', 'electric', 'explosive', 'intense', 'passionate',
      
      // Modern expressions
      'amped up', 'fired up', 'ready to go', 'full of energy', 'bouncing off walls',
      'hyper', 'wired', 'buzzed', 'high energy', 'full throttle', 'go mode',
      'beast mode', 'power mode', 'unstoppable', 'on fire', 'crushing it',
      
      // Activity-related
      'workout', 'exercise', 'run', 'dance', 'move', 'action', 'adventure',
      'thrill', 'rush', 'adrenaline', 'pump', 'boost', 'surge'
    ],
    
    [MOOD_CATEGORIES.STUDY]: [
      // Basic study words
      'study', 'studying', 'focus', 'focused', 'learning', 'homework', 'assignment',
      'exam', 'test', 'quiz', 'research', 'reading', 'writing', 'work', 'working',
      'concentration', 'concentrate', 'academic', 'school', 'university', 'college',
      
      // Modern expressions
      'grinding', 'hitting the books', 'cramming', 'pulling an all-nighter',
      'study mode', 'deep work', 'flow state', 'in the zone', 'locked in',
      
      // Mental states
      'analytical', 'thoughtful', 'contemplative', 'reflective', 'intellectual',
      'cerebral', 'mental', 'cognitive', 'processing', 'absorbing', 'retaining'
    ],
    
    [MOOD_CATEGORIES.SOOTHING]: [
      // Basic soothing words
      'tired', 'sleepy', 'exhausted', 'drained', 'weary', 'worn out', 'fatigued',
      'drowsy', 'yawning', 'need rest', 'need sleep', 'comfort', 'cozy', 'warm',
      'soft', 'gentle', 'tender', 'nurturing', 'healing', 'recovery', 'restore',
      
      // Modern expressions
      'dead tired', 'wiped out', 'running on empty', 'need to recharge', 'battery low',
      'need downtime', 'self care', 'me time', 'wind down', 'decompress',
      
      // Comfort seeking
      'cuddle', 'snuggle', 'blanket', 'tea', 'bath', 'massage', 'spa', 'retreat',
      'sanctuary', 'refuge', 'haven', 'solace', 'soothe', 'comfort food'
    ]
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
