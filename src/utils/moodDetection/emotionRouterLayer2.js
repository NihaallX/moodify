/**
 * Layer 2: Emotion Router (Contextual Analyzer)
 * Takes Layer 1 AI result + raw text and refines it with contextual analysis
 */

import { MOOD_CATEGORIES } from './constants';

/**
 * Intensity words that modify emotion strength
 */
const INTENSITY_MODIFIERS = {
  high: ['extremely', 'very', 'really', 'super', 'incredibly', 'totally', 'completely', 'absolutely', 'utterly'],
  low: ['slightly', 'a bit', 'somewhat', 'kinda', 'sort of', 'mildly', 'little bit', 'barely']
};

/**
 * Context keywords that override or modify base emotion
 */
const CONTEXT_KEYWORDS = {
  tired: ['tired', 'exhausted', 'drained', 'sleepy', 'worn out', 'fatigued', 'weary'],
  work: ['work', 'job', 'office', 'meeting', 'deadline', 'project', 'boss'],
  study: ['study', 'exam', 'homework', 'school', 'university', 'test', 'assignment', 'learning'],
  workout: ['workout', 'exercise', 'gym', 'running', 'fitness', 'training'],
  social: ['friends', 'party', 'date', 'family', 'social', 'hang out', 'gathering'],
  relaxation: ['chill', 'relax', 'rest', 'peace', 'quiet', 'calm down', 'unwind']
};

/**
 * Compound emotion patterns
 */
const COMPOUND_PATTERNS = [
  { pattern: /happy.*tired|tired.*happy/, result: MOOD_CATEGORIES.SOOTHING },
  { pattern: /sad.*motivated|motivated.*sad/, result: MOOD_CATEGORIES.FOCUSED },
  { pattern: /angry.*focused|focused.*angry/, result: MOOD_CATEGORIES.ENERGETIC },
  { pattern: /excited.*nervous|nervous.*excited/, result: MOOD_CATEGORIES.ANXIOUS },
  { pattern: /happy.*workout|workout.*happy/, result: MOOD_CATEGORIES.ENERGETIC },
  { pattern: /stressed.*study|study.*stressed/, result: MOOD_CATEGORIES.STUDY }
];

/**
 * Map AI emotions to base moods
 */
const AI_TO_MOOD_MAP = {
  joy: MOOD_CATEGORIES.HAPPY,
  sadness: MOOD_CATEGORIES.SAD,
  anger: MOOD_CATEGORIES.ANGRY,
  fear: MOOD_CATEGORIES.ANXIOUS,
  surprise: MOOD_CATEGORIES.ENERGETIC,
  disgust: MOOD_CATEGORIES.ANGRY
};

/**
 * Analyze text for intensity modifiers
 * @param {string} text - Input text
 * @returns {string} 'high', 'low', or 'normal'
 */
const analyzeIntensity = (text) => {
  const lowerText = text.toLowerCase();
  
  if (INTENSITY_MODIFIERS.high.some(word => lowerText.includes(word))) {
    return 'high';
  }
  if (INTENSITY_MODIFIERS.low.some(word => lowerText.includes(word))) {
    return 'low';
  }
  return 'normal';
};

/**
 * Analyze text for contextual clues
 * @param {string} text - Input text
 * @returns {Array} Array of detected contexts
 */
const analyzeContext = (text) => {
  const lowerText = text.toLowerCase();
  const contexts = [];
  
  Object.entries(CONTEXT_KEYWORDS).forEach(([context, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      contexts.push(context);
    }
  });
  
  return contexts;
};

/**
 * Check for compound emotion patterns
 * @param {string} text - Input text
 * @returns {string|null} Detected compound mood or null
 */
const analyzeCompoundEmotions = (text) => {
  const lowerText = text.toLowerCase();
  
  for (const { pattern, result } of COMPOUND_PATTERNS) {
    if (pattern.test(lowerText)) {
      return result;
    }
  }
  
  return null;
};

/**
 * Layer 2: Emotion Router - Contextual Analysis
 * @param {Object} aiResult - Result from Layer 1 AI detection
 * @param {string} rawText - Original user input
 * @returns {Object} Refined emotion analysis
 */
export const refineEmotion = (aiResult, rawText) => {
  // First check for compound emotions - these override everything
  const compoundMood = analyzeCompoundEmotions(rawText);
  if (compoundMood) {
    console.log('Layer 2: Detected compound emotion ->', compoundMood);
    return {
      finalMood: compoundMood,
      reasoning: 'compound_emotion',
      aiEmotion: aiResult.emotion,
      confidence: aiResult.confidence
    };
  }
  
  // Map AI emotion to base mood
  const baseMood = AI_TO_MOOD_MAP[aiResult.emotion] || MOOD_CATEGORIES.HAPPY;
  
  // Analyze context and intensity
  const intensity = analyzeIntensity(rawText);
  const contexts = analyzeContext(rawText);
  
  let finalMood = baseMood;
  let reasoning = 'ai_direct';
  
  // Apply contextual modifications
  if (contexts.includes('tired')) {
    finalMood = MOOD_CATEGORIES.SOOTHING;
    reasoning = 'context_tired';
  } else if (contexts.includes('study')) {
    finalMood = MOOD_CATEGORIES.STUDY;
    reasoning = 'context_study';
  } else if (contexts.includes('workout') && (baseMood === MOOD_CATEGORIES.HAPPY || baseMood === MOOD_CATEGORIES.ENERGETIC)) {
    finalMood = MOOD_CATEGORIES.ENERGETIC;
    reasoning = 'context_workout';
  } else if (contexts.includes('relaxation')) {
    finalMood = MOOD_CATEGORIES.CALM;
    reasoning = 'context_relaxation';
  }
  
  // Apply intensity modifications
  if (intensity === 'low' && baseMood === MOOD_CATEGORIES.HAPPY) {
    finalMood = MOOD_CATEGORIES.CALM;
    reasoning = 'intensity_low';
  } else if (intensity === 'high' && baseMood === MOOD_CATEGORIES.HAPPY) {
    finalMood = MOOD_CATEGORIES.ENERGETIC;
    reasoning = 'intensity_high';
  }
  
  console.log('Layer 2: Refined emotion ->', {
    aiEmotion: aiResult.emotion,
    baseMood,
    intensity,
    contexts,
    finalMood,
    reasoning
  });
  
  return {
    finalMood,
    reasoning,
    aiEmotion: aiResult.emotion,
    confidence: aiResult.confidence,
    intensity,
    contexts
  };
};
