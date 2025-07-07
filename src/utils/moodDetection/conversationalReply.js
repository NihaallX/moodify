/**
 * Conversational Reply Generator
 * Generates empathetic responses based on detected mood
 */

import { MOOD_CATEGORIES } from './constants';

/**
 * Generate follow-up question asking if user wants playlist recommendations
 * @param {string} mood - Detected mood
 * @returns {string} Follow-up question
 */
export const generateFollowUpQuestion = (mood) => {
  const followUpQuestions = {
    [MOOD_CATEGORIES.HAPPY]: [
      "Got it! Want me to pull up some upbeat playlists to match your mood?",
      "I hear you! Should I find some feel-good tracks to keep the vibes going?",
      "Love it! Ready for some music that matches your happy energy?",
      "Perfect! Want me to recommend some playlists to boost that mood even more?"
    ],
    
    [MOOD_CATEGORIES.SAD]: [
      "I understand. Would you like me to find some comforting music that might help?",
      "I hear you. Want me to pull up some gentle playlists that understand how you're feeling?",
      "Got it. Should I recommend some music that might offer some comfort right now?",
      "I feel you. Would some carefully chosen music help you through this moment?"
    ],
    
    [MOOD_CATEGORIES.ANGRY]: [
      "I get it. Want me to find some music that channels that energy constructively?",
      "Understood. Should I pull up some powerful tracks that match that intensity?",
      "I hear the frustration. Want some music that gets it and helps you process?",
      "Got it. Ready for some playlists that understand and channel that fire?"
    ],
    
    [MOOD_CATEGORIES.ANXIOUS]: [
      "I understand that feeling. Want me to find some calming music to help ease those nerves?",
      "I hear you. Should I pull up some soothing playlists that might help you find peace?",
      "Got it. Would you like some gentle music to help center yourself?",
      "I feel that. Want some carefully chosen tracks to help you breathe easier?"
    ],
    
    [MOOD_CATEGORIES.ENERGETIC]: [
      "I love that energy! Want me to find some high-energy playlists to fuel that power?",
      "Feeling that buzz! Should I pull up some tracks that match that electric vibe?",
      "Amazing energy! Ready for some music that'll amplify that unstoppable feeling?",
      "Love it! Want some playlists that'll keep that incredible energy flowing?"
    ],
    
    [MOOD_CATEGORIES.CALM]: [
      "Nice and peaceful. Want me to find some mellow music to complement that zen state?",
      "Love those chill vibes. Should I pull up some relaxed playlists to match?",
      "Perfect tranquility. Ready for some music that honors that peaceful moment?",
      "Beautiful calm energy. Want some gentle tracks to maintain that serenity?"
    ],
    
    [MOOD_CATEGORIES.STUDY]: [
      "Focus mode detected! Want me to find some concentration-friendly playlists?",
      "Ready to get in the zone! Should I pull up some study-perfect tracks?",
      "Academic grind time? Want some music that helps the brain work optimally?",
      "Study session incoming! Ready for some focus-enhancing playlists?"
    ],
    
    [MOOD_CATEGORIES.SOOTHING]: [
      "Sounds like you need some comfort. Want me to find music for winding down?",
      "Time to recharge detected. Should I pull up some gentle, healing playlists?",
      "Self-care mode activated. Want some soft music for restoration?",
      "Everyone needs downtime. Ready for some comforting, restorative tracks?"
    ],
    
    [MOOD_CATEGORIES.FOCUSED]: [
      "Love that determined energy! Want me to find music to keep you locked in?",
      "Focused and ready! Should I pull up tracks that'll maintain that flow state?",
      "In the zone already! Want some music that supports that incredible focus?",
      "That drive is impressive! Ready for your personalized focus soundtrack?"
    ]
  };
  
  // Get questions for the mood, fallback to general question if not found
  const moodQuestions = followUpQuestions[mood] || [
    "Got it! Want me to pull up some playlists that match your current mood?",
    "I understand. Should I find some music that fits how you're feeling?",
    "Perfect! Ready for some personalized playlist recommendations?",
    "I hear you! Want me to recommend some tracks that match your vibe?"
  ];
  
  // Select random question
  return moodQuestions[Math.floor(Math.random() * moodQuestions.length)];
};

/**
 * Check if user response indicates positive intent for playlist recommendations
 * @param {string} userResponse - User's response to follow-up question
 * @returns {boolean} Whether user wants playlist recommendations
 */
export const detectPositiveIntent = (userResponse) => {
  if (!userResponse || typeof userResponse !== 'string') return false;
  
  const response = userResponse.toLowerCase().trim();
  
  // Strong positive indicators
  const strongPositive = [
    'yes', 'yeah', 'yep', 'sure', 'absolutely', 'definitely', 'please', 'go ahead',
    'let\'s do it', 'sounds good', 'perfect', 'great', 'awesome', 'love it',
    'do it', 'hit me', 'bring it on', 'i\'d love that', 'that\'d be great',
    'yes please', 'hell yeah', 'for sure', 'of course', 'totally'
  ];
  
  // Moderate positive indicators (need more context)
  const moderatePositive = [
    'ok', 'okay', 'fine', 'alright', 'good', 'nice', 'cool', 'why not',
    'i guess', 'maybe', 'could work', 'sounds ok', 'that works'
  ];
  
  // Negative indicators
  const negative = [
    'no', 'nah', 'nope', 'not really', 'no thanks', 'i\'m good', 'maybe later',
    'not now', 'not interested', 'skip', 'pass', 'don\'t', 'won\'t', 'can\'t'
  ];
  
  // Check for exact matches first
  if (strongPositive.some(phrase => response === phrase || response.includes(phrase))) {
    return true;
  }
  
  if (negative.some(phrase => response === phrase || response.includes(phrase))) {
    return false;
  }
  
  // Check moderate positive with additional context
  if (moderatePositive.some(phrase => response === phrase)) {
    return true; // Lean positive for moderate indicators
  }
  
  // Check for positive phrases within longer responses
  const positivePatterns = [
    /yes.*please/i, /sure.*that/i, /go.*ahead/i, /sounds.*good/i,
    /that.*great/i, /love.*to/i, /would.*like/i, /i.*want/i,
    /let.*go/i, /bring.*it/i, /hit.*me/i, /why.*not/i
  ];
  
  if (positivePatterns.some(pattern => pattern.test(response))) {
    return true;
  }
  
  // If response is very short and ambiguous, lean slightly positive
  if (response.length <= 3 && !negative.some(phrase => response.includes(phrase))) {
    return response.includes('y') || response.includes('k'); // "y", "k", "yk" etc.
  }
  
  // Default to false for unclear responses
  return false;
};

/**
 * Generate conversational reply based on refined mood
 * @param {Object} emotionAnalysis - Result from Layer 2
 * @param {string} rawText - Original user input
 * @returns {string} Conversational reply
 */
export const generateReply = (emotionAnalysis, rawText) => {
  const { finalMood, reasoning, intensity } = emotionAnalysis;
  
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
