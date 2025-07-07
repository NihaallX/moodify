/**
 * Layer 1: AI Emotion Detection
 * Uses Hartmann's emotion classification model via Hugging Face API
 * Returns one of 6 basic emotions: joy, sadness, anger, fear, surprise, disgust
 */

/**
 * Call Hartmann AI API via Hugging Face Inference API
 * @param {string} text - User's chat message
 * @returns {Promise<Object>} AI response with emotion and confidence
 */
const callHartmannAI = async (text) => {
  const token = process.env.REACT_APP_HUGGINGFACE_TOKEN;
  if (!token || token.trim() === '') {
    throw new Error('Hugging Face token not available');
  }
  
  const apiUrl = 'https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base';
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);
  
  try {
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
    
    if (!response.ok) {
      throw new Error(`API returned status code ${response.status}`);
    }
    
    const result = await response.json();
    
    // Parse emotions array
    let emotions = [];
    if (Array.isArray(result)) {
      emotions = result.length > 0 && Array.isArray(result[0]) ? result[0] : result;
    } else if (result && result.emotions) {
      emotions = result.emotions;
    } else if (result && result.label) {
      emotions = [result];
    }
    
    if (emotions.length > 0 && emotions[0].label) {
      // Find emotion with highest confidence
      const topEmotion = emotions.reduce((prev, current) => {
        return (prev.score || 0) > (current.score || 0) ? prev : current;
      });
      
      return {
        emotion: topEmotion.label.toLowerCase(),
        confidence: topEmotion.score || 0.5
      };
    }
    
    throw new Error('Could not parse AI response');
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Layer 1: AI Emotion Detection
 * @param {string} text - User input text
 * @returns {Promise<Object>} Emotion detection result
 */
export const detectEmotionAI = async (text) => {
  try {
    const result = await callHartmannAI(text);
    console.log('Layer 1 (AI) detected:', result);
    return result;
  } catch (error) {
    console.error('Layer 1 AI detection failed:', error);
    throw error;
  }
};
