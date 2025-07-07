/**
 * Conversational Reply Generator
 * Generates empathetic responses based on detected mood
 */

import { MOOD_CATEGORIES } from './constants';

/**
 * Generate conversational reply based on refined mood
 * @param {Object} emotionAnalysis - Result from Layer 2
 * @param {string} rawText - Original user input
 * @returns {string} Conversational reply
 */
export const generateReply = (emotionAnalysis, rawText) => {
  const { finalMood, reasoning, aiEmotion, intensity, contexts } = emotionAnalysis;
  
  const replies = {
    [MOOD_CATEGORIES.HAPPY]: [
      "Love the positive vibes! 🌟 Let me find some upbeat tracks to match your energy.",
      "You sound great! Here's some music to keep those good vibes flowing.",
      "Awesome mood! I've got some feel-good music that'll hit just right.",
      "Feeling the joy! Let's keep this energy going with some perfect tunes."
    ],
    
    [MOOD_CATEGORIES.SAD]: [
      "I hear you... sometimes we all need music that understands. 💙",
      "Rough times call for the right soundtrack. Let me find something that fits.",
      "Music can be healing. Here are some tracks that might help you through this.",
      "Sending some comfort your way through music. You're not alone in this."
    ],
    
    [MOOD_CATEGORIES.ANGRY]: [
      "Need to let off some steam? I've got tracks that channel that energy perfectly.",
      "Sometimes anger needs the right outlet. Here's music to match that fire.",
      "Feeling fired up? Let's find some music that gets it.",
      "Raw energy calls for raw music. Here's something that'll hit hard."
    ],
    
    [MOOD_CATEGORIES.ANXIOUS]: [
      "Take a deep breath... I've got some calming music to help ease those nerves.",
      "Anxiety is tough, but music can help. Here's something to center yourself.",
      "When the world feels overwhelming, music can be an anchor. Try these.",
      "Feeling on edge? Let me find something to help you find your calm."
    ],
    
    [MOOD_CATEGORIES.ENERGETIC]: [
      "You're buzzing with energy! Time for some tracks that match that power! ⚡",
      "High energy calls for high-impact music! Let's amp this up!",
      "Feeling unstoppable? Here's music that'll fuel that fire!",
      "Ready to conquer the world? I've got the perfect soundtrack!"
    ],
    
    [MOOD_CATEGORIES.CALM]: [
      "Nice and peaceful... Here's some mellow music to complement that zen state.",
      "Loving the chill vibes. Let me find something equally relaxed.",
      "Peaceful moments deserve peaceful music. Here's your soundtrack.",
      "That's the spirit - calm and centered. Here's music to match."
    ],
    
    [MOOD_CATEGORIES.STUDY]: [
      "Focus mode activated! 📚 Here's some concentration-friendly music.",
      "Time to get in the zone! I've got study-perfect tracks for you.",
      "Academic grind time? Here's music that helps the brain work.",
      "Study session incoming! These tracks will keep you focused."
    ],
    
    [MOOD_CATEGORIES.SOOTHING]: [
      "Sounds like you need some comfort... Here's music for winding down. 🌙",
      "Time to recharge. I've got some gentle music to help you rest.",
      "Everyone needs downtime. Here's something soft and healing.",
      "Self-care mode? Perfect. Here's music for restoration."
    ],
    
    [MOOD_CATEGORIES.FOCUSED]: [
      "Love that determined energy! Here's music to keep you locked in.",
      "Focused and ready? I've got tracks that'll maintain that flow state.",
      "When you're in the zone, music should support it. Here you go.",
      "That drive is impressive! Here's your focus soundtrack."
    ]
  };
  
  // Get replies for the mood, fallback to happy if not found
  const moodReplies = replies[finalMood] || replies[MOOD_CATEGORIES.HAPPY];
  
  // Select random reply
  const baseReply = moodReplies[Math.floor(Math.random() * moodReplies.length)];
  
  // Add contextual modifications based on reasoning
  let contextualAddition = '';
  
  if (reasoning === 'compound_emotion') {
    contextualAddition = ' I picked up on the mixed feelings in your message.';
  } else if (reasoning === 'context_tired') {
    contextualAddition = ' Perfect for when you need to recharge.';
  } else if (reasoning === 'context_study') {
    contextualAddition = ' Great for keeping your mind sharp!';
  } else if (reasoning === 'context_workout') {
    contextualAddition = ' Perfect workout fuel! 💪';
  } else if (intensity === 'high') {
    contextualAddition = ' Going all-in with this energy!';
  } else if (intensity === 'low') {
    contextualAddition = ' Something gentle for your current vibe.';
  }
  
  return baseReply + contextualAddition;
};
