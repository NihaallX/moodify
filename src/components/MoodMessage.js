import React from 'react';
import './MoodMessage.css';

function MoodMessage({ mood }) {
  // Messages for each mood
  const moodMessages = {
    anxious: [
      "Take a deep breath. Music can help calm your mind.",
      "It's okay to feel anxious. Let's find some calming tunes.",
      "We've got some music that might help ease your anxiety."
    ],
    calm: [
      "Peace looks good on you. Here's more to enjoy.",
      "Embrace the tranquility. These songs will keep you centered.",
      "Enjoy your calm state with these soothing melodies."
    ],
    happy: [
      "Woah, I love this energy! Let's keep it going!",
      "Your happiness is contagious! Here's some music to match.",
      "Glad you're feeling good! These tracks will boost your mood even more."
    ],
    sad: [
      "You'll get through this. Breathe and let the music in.",
      "It's okay to not be okay. These songs might comfort you.",
      "Sending some musical comfort your way."
    ],
    energetic: [
      "Let's channel that energy into something amazing!",
      "You're on fire today! These tracks will match your vibe.",
      "Keep that awesome energy going with these upbeat tunes."
    ],
    study: [
      "Focus mode activated. Let's get productive!",
      "Ready to ace your study session? These tracks will help you concentrate.",
      "Boost your productivity with these focus-enhancing melodies."
    ],
    soothing: [
      "Take a moment for yourself. Relax and unwind with these melodies.",
      "Let the tension melt away. These tracks are perfect for relaxation.",
      "Sometimes we all need to wind down. These songs will help."
    ],
    angry: [
      "Let the music help you process those feelings.",
      "It's okay to feel frustrated. These tracks might help you express it.",
      "Channel that intensity into something positive with these powerful tracks."
    ],
    focused: [
      "You're in the zone! Let's keep that focus sharp.",
      "Stay on track with these concentration-boosting tunes.",
      "Maintain your laser focus with this carefully selected playlist."
    ]
  };

  // Choose a random message for the detected mood
  const getMessage = (mood) => {
    const messages = moodMessages[mood] || ["Here's some music that matches your current mood."];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  return (
    <div className="mood-message">
      <div className="mood-badge">{mood}</div>
      <p className="message-text">{getMessage(mood)}</p>
    </div>
  );
}

export default MoodMessage;
