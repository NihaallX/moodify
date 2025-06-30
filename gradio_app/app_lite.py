import gradio as gr
import json
import re

# This is a simplified version that doesn't require the large Mistral model
# It's more suitable for deployment on free CPU instances

# List of valid mood categories to ensure consistent output
VALID_MOODS = [
    "anxious", "calm", "happy", "sad", "energetic", 
    "study", "soothing", "angry", "focused", "neutral"
]

# Keywords for rule-based mood detection
mood_keywords = {
    "anxious": ["anxious", "nervous", "worried", "stress", "stressed", "panic", "fear", "scared",
        "uneasy", "apprehensive", "jittery", "tense", "frightened", "concerned",
        "anxiety", "uncertainty", "dread", "agitated", "restless", "insecure"],
    "calm": ["calm", "peaceful", "relaxed", "serene", "tranquil", "content", "ease", "meditation",
        "quiet", "still", "composed", "collected", "untroubled", "placid", "zen",
        "steady", "mellow", "cool", "unruffled", "stable", "balanced"],
    "happy": ["happy", "joy", "cheerful", "excited", "glad", "pleased", "delighted", "thrilled",
        "optimistic", "elated", "jubilant", "ecstatic", "upbeat", "cheery", "blissful",
        "gleeful", "jolly", "lively", "positive", "satisfied", "content", "good mood"],
    "sad": ["sad", "down", "unhappy", "miserable", "depressed", "gloomy", "blue", "melancholy", 
        "upset", "heartbroken", "sorrowful", "dejected", "downcast", "downhearted", "grieving",
        "mournful", "tearful", "despondent", "disheartened", "troubled", "heavy-hearted"],
    "energetic": ["energy", "energetic", "pumped", "active", "vigorous", "lively", "dynamic", "vibrant", 
        "workout", "motivated", "invigorated", "spirited", "enthusiastic", "peppy", "animated",
        "vivacious", "exuberant", "fired up", "full of life", "zestful", "eager"],
    "study": ["study", "focus", "concentration", "homework", "learning", "reading", "exam", "test",
        "productive", "academic", "intellectual", "scholarly", "educational", "research",
        "analytical", "thoughtful", "contemplative", "reflective", "absorbed", "engrossed"],
    "soothing": ["soothe", "soothing", "comfort", "gentle", "soft", "relax", "sleep", "dream", "cozy",
        "comforting", "restful", "calming", "healing", "therapeutic", "pacifying",
        "lulling", "consoling", "reassuring", "nurturing", "warm", "secure"],
    "angry": ["angry", "mad", "furious", "rage", "annoyed", "irritated", "frustrated", "upset", "hate",
        "irate", "enraged", "infuriated", "outraged", "livid", "seething", "incensed", 
        "indignant", "vexed", "cross", "bitter", "heated", "hostile"],
    "focused": ["focused", "determined", "resolute", "committed", "attentive", "dedicated", "concentrate",
        "mindful", "intent", "diligent", "steadfast", "precise", "alert", "sharp",
        "disciplined", "purposeful", "driven", "single-minded", "unwavering", "persistent"]
}

def detect_mood(user_message):
    """
    Rule-based mood detection from text input
    """
    if not user_message or not user_message.strip():
        return json.dumps({"mood": "neutral"})
    
    try:
        text = user_message.lower()
        
        # Count keyword matches for each mood
        mood_scores = {}
        for mood, keywords in mood_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text)
            mood_scores[mood] = score
        
        # Find the mood with the highest score
        max_score = max(mood_scores.values()) if mood_scores else 0
        
        if max_score > 0:
            mood = max(mood_scores.items(), key=lambda x: x[1])[0]
            return json.dumps({"mood": mood})
        
        # If no keywords matched, try to detect sentiment
        positive_words = ["good", "great", "excellent", "wonderful", "amazing", "love", "enjoy", "nice", "happy"]
        negative_words = ["bad", "terrible", "awful", "horrible", "hate", "dislike", "sad", "upset", "angry"]
        
        positive_count = sum(1 for word in positive_words if word in text)
        negative_count = sum(1 for word in negative_words if word in text)
        
        if positive_count > negative_count:
            return json.dumps({"mood": "happy"})
        elif negative_count > positive_count:
            return json.dumps({"mood": "sad"})
        
        return json.dumps({"mood": "neutral"})
    except Exception as e:
        print(f"Error in mood detection: {str(e)}")
        return json.dumps({"mood": "neutral", "error": str(e)})

# Create Gradio Interface
demo = gr.Interface(
    fn=detect_mood,
    inputs=[gr.Textbox(label="How are you feeling?", placeholder="Tell me about your day or how you're feeling...")],
    outputs=gr.JSON(label="Detected Mood"),
    title="Moodify - Mood Detection (Lite Version)",
    description="Share how you're feeling and I'll detect your mood.",
    theme=gr.themes.Soft(),
    allow_flagging="never",
)

# Launch the app
demo.launch()
