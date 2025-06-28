/**
 * Emoji Slider Mood Detection
 * Maps emoji slider values to specific moods
 */

// Define mood categories directly to avoid circular imports
const MOOD_CATEGORIES = {
  ANXIOUS: 'anxious',
  CALM: 'calm',
  HAPPY: 'happy',
  SAD: 'sad',
  ENERGETIC: 'energetic',
  STUDY: 'study',
  SOOTHING: 'soothing',
  ANGRY: 'angry',
  FOCUSED: 'focused'
};

// Enhanced emoji mood mapping (0-10 scale)
const emojiMoodMap = [
  MOOD_CATEGORIES.SAD,       // 0: Very sad
  MOOD_CATEGORIES.SAD,       // 1: Sad
  MOOD_CATEGORIES.ANXIOUS,   // 2: Anxious
  MOOD_CATEGORIES.CALM,      // 3: Calm
  MOOD_CATEGORIES.SOOTHING,  // 4: Soothing
  MOOD_CATEGORIES.FOCUSED,   // 5: Focused
  MOOD_CATEGORIES.STUDY,     // 6: Study mode
  MOOD_CATEGORIES.HAPPY,     // 7: Happy
  MOOD_CATEGORIES.HAPPY,     // 8: Very happy
  MOOD_CATEGORIES.ENERGETIC, // 9: Energetic
  MOOD_CATEGORIES.ANGRY      // 10: Angry/intense
];

/**
 * Detects mood from emoji slider value
 * @param {number} value - Emoji slider value (0-10)
 * @returns {Promise<string>} - Promise resolving to detected mood
 */
export const detectMoodFromEmoji = async (value) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Ensure value is within bounds
      const safeValue = Math.max(0, Math.min(10, Math.round(value)));
      resolve(emojiMoodMap[safeValue]);
    }, 500); // Reduced delay for better UX
  });
};

// Export emoji mapping for reference
export const getEmojiMoodDescription = (value) => {
  const safeValue = Math.max(0, Math.min(10, Math.round(value)));
  return {
    value: safeValue,
    mood: emojiMoodMap[safeValue],
    description: getDescriptionForValue(safeValue)
  };
};

// Helper function to get a description for each emoji value
const getDescriptionForValue = (value) => {
  const descriptions = [
    "Very sad or down",
    "Sad or melancholic",
    "Anxious or worried",
    "Calm and peaceful",
    "Relaxed and soothed",
    "Focused and attentive",
    "Studious and concentrated",
    "Happy and upbeat",
    "Very happy and cheerful",
    "Energetic and lively",
    "Intense or angry"
  ];
  
  return descriptions[value] || "Neutral";
};
