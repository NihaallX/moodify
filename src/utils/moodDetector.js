/**
 * Utility for detecting mood from user input
 * This is a simplified version using basic text matching
 * In a production app, you might use a more sophisticated NLP model
 */

// Mood categories and related keywords
const moodKeywords = {
  anxious: ['anxious', 'nervous', 'worried', 'stress', 'stressed', 'panic', 'fear', 'scared'],
  calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'content', 'ease', 'meditation'],
  happy: ['happy', 'joy', 'cheerful', 'excited', 'glad', 'pleased', 'delighted', 'thrilled', 'optimistic'],
  sad: ['sad', 'down', 'unhappy', 'miserable', 'depressed', 'gloomy', 'blue', 'melancholy', 'upset', 'heartbroken'],
  energetic: ['energy', 'energetic', 'pumped', 'active', 'vigorous', 'lively', 'dynamic', 'vibrant', 'workout'],
  study: ['study', 'focus', 'concentration', 'homework', 'learning', 'reading', 'exam', 'test', 'productive'],
  soothing: ['soothe', 'soothing', 'comfort', 'gentle', 'soft', 'relax', 'sleep', 'dream', 'cozy'],
  angry: ['angry', 'mad', 'furious', 'rage', 'annoyed', 'irritated', 'frustrated', 'upset', 'hate'],
  focused: ['focused', 'determined', 'resolute', 'committed', 'attentive', 'dedicated', 'concentrate', 'mindful']
};

// Map emoji slider values to moods
const emojiMoodMap = [
  'sad',      // 0
  'sad',      // 1
  'anxious',  // 2
  'calm',     // 3
  'soothing', // 4
  'focused',  // 5
  'study',    // 6
  'happy',    // 7
  'energetic', // 8
  'energetic', // 9
  'angry'     // 10
];

/**
 * Detects mood from text input
 * @param {string} text - User input text
 * @returns {string} - Detected mood category
 */
const detectMoodFromText = (text) => {
  // Convert to lowercase for matching
  const lowercaseText = text.toLowerCase();
  
  // Check each mood category for keyword matches
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
  
  // Default to 'happy' if no matches found
  return bestMatch || 'happy';
};

/**
 * Detects mood from emoji slider value
 * @param {number} value - Emoji slider value (0-10)
 * @returns {string} - Detected mood category
 */
const detectMoodFromEmoji = (value) => {
  // Ensure value is within bounds
  const safeValue = Math.max(0, Math.min(10, value));
  return emojiMoodMap[safeValue];
};

/**
 * Main mood detection function
 * @param {string|number} input - Either text input or emoji slider value
 * @param {string} inputType - Either 'text' or 'emoji'
 * @returns {Promise<string>} - Promise resolving to detected mood
 */
export const detectMood = async (input, inputType) => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      if (inputType === 'text') {
        resolve(detectMoodFromText(input));
      } else {
        resolve(detectMoodFromEmoji(input));
      }
    }, 1000); // 1 second delay to simulate processing
  });
};
