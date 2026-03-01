/**
 * Groq-powered mood detector
 * Uses llama-3.3-70b-versatile to detect emotion + generate a warm reply
 * in a single API call.
 */

import { MOOD_CATEGORIES } from './constants';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const VALID_MOODS = Object.values(MOOD_CATEGORIES);

const SYSTEM_PROMPT = `You are Moodify, a friendly music assistant that detects the user's emotional state from what they write.

Your job:
1. Read the user's message carefully.
2. Pick the most fitting mood from this list ONLY:
   happy, sad, angry, anxious, calm, energetic, study, soothing, focused
3. Write a short, warm, empathetic reply (1–2 sentences max) that acknowledges how they feel.

Rules:
- "study" is for when someone mentions studying, homework, exams, work, or focus tasks.
- "soothing" is for tiredness, needing rest, or winding down.
- "focused" is for determined, driven, or goal-oriented feelings.
- "energetic" is for excitement, hype, or wanting to move.
- "anxious" is for worry, stress, or nervousness.
- If the user is just asking for music without sharing a feeling, default to "happy".

Respond in valid JSON only, no extra text:
{"mood": "<one of the valid moods>", "reply": "<your reply>"}`;

/**
 * Detect mood and generate a reply using Groq's LLM
 * @param {string} text - User's chat message
 * @returns {Promise<{mood: string, reply: string}>}
 */
export const detectMoodWithGroq = async (text) => {
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    console.warn('Groq API key not set. Falling back to keyword detection.');
    return fallbackDetect(text);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text }
        ],
        temperature: 0.4,
        max_tokens: 120,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) throw new Error('Empty response from Groq');

    const parsed = JSON.parse(raw);
    const mood = VALID_MOODS.includes(parsed.mood) ? parsed.mood : MOOD_CATEGORIES.HAPPY;
    const reply = parsed.reply || "I've picked some music that matches your vibe! 🎵";

    console.log(`Groq detected mood: ${mood} | reply: ${reply}`);
    return { mood, reply };

  } catch (error) {
    clearTimeout(timeout);
    console.error('Groq detection failed, using fallback:', error.message);
    return fallbackDetect(text);
  }
};

/**
 * Keyword-based fallback when Groq is unavailable
 * @param {string} text
 * @returns {{mood: string, reply: string}}
 */
const fallbackDetect = (text) => {
  const t = text.toLowerCase();
  const keywords = {
    [MOOD_CATEGORIES.SAD]:      ['sad', 'down', 'depressed', 'unhappy', 'cry', 'hurt', 'heartbreak', 'miss'],
    [MOOD_CATEGORIES.ANGRY]:    ['angry', 'mad', 'furious', 'frustrated', 'annoyed', 'rage', 'hate'],
    [MOOD_CATEGORIES.ANXIOUS]:  ['anxious', 'nervous', 'worried', 'stress', 'scared', 'panic', 'fear'],
    [MOOD_CATEGORIES.CALM]:     ['calm', 'peaceful', 'relaxed', 'chill', 'serene', 'zen', 'tranquil'],
    [MOOD_CATEGORIES.ENERGETIC]:['energy', 'pumped', 'hype', 'excited', 'active', 'workout', 'gym', 'run'],
    [MOOD_CATEGORIES.STUDY]:    ['study', 'homework', 'exam', 'work', 'focus', 'learning', 'assignment'],
    [MOOD_CATEGORIES.SOOTHING]: ['tired', 'exhausted', 'sleepy', 'rest', 'comfort', 'gentle', 'wind down'],
    [MOOD_CATEGORIES.FOCUSED]:  ['focused', 'determined', 'motivated', 'goal', 'grind', 'dedicated'],
    [MOOD_CATEGORIES.HAPPY]:    ['happy', 'joy', 'great', 'awesome', 'good', 'amazing', 'love', 'fantastic']
  };

  for (const [mood, words] of Object.entries(keywords)) {
    if (words.some(w => t.includes(w))) {
      return { mood, reply: "I've found some music just for you! 🎵" };
    }
  }

  return { mood: MOOD_CATEGORIES.HAPPY, reply: "Here's some music to match your vibe! 🎵" };
};
