import gradio as gr
from transformers import pipeline
import json

# Use Hartmann emotion classification model - specifically trained for emotions
emotion_classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=True
)

# Map emotion model outputs to Moodify mood categories
EMOTION_TO_MOOD_MAP = {
    "joy": "happy",
    "sadness": "sad", 
    "anger": "angry",
    "fear": "anxious",
    "surprise": "energetic",
    "disgust": "angry"
}

# Moodify's mood categories
VALID_MOODS = [
    "anxious", "calm", "happy", "sad", "energetic", 
    "study", "soothing", "angry", "focused", "neutral"
]

def detect_mood_ai(user_message):
    """
    AI-powered mood detection using Hartmann emotion classification
    Returns JSON with detected mood
    """
    if not user_message or not user_message.strip():
        return json.dumps({"mood": "neutral"})
    
    try:
        # Get emotion predictions from the AI model
        emotions = emotion_classifier(user_message)
        
        # Find the emotion with highest confidence
        top_emotion = max(emotions, key=lambda x: x['score'])
        emotion_label = top_emotion['label'].lower()
        confidence = top_emotion['score']
        
        # Map AI emotion to Moodify mood
        detected_mood = EMOTION_TO_MOOD_MAP.get(emotion_label, "neutral")
        
        # Context-aware adjustments for specific Moodify categories
        text_lower = user_message.lower()
        if confidence < 0.6:  # Low confidence, check for specific keywords
            if any(word in text_lower for word in ["study", "homework", "exam", "learning", "focus"]):
                detected_mood = "study"
            elif any(word in text_lower for word in ["sleep", "tired", "relax", "peaceful", "cozy"]):
                detected_mood = "soothing"
            elif any(word in text_lower for word in ["work", "concentrate", "productive", "determined"]):
                detected_mood = "focused"
            elif any(word in text_lower for word in ["calm", "zen", "meditation", "tranquil", "serene"]):
                detected_mood = "calm"
        
        return json.dumps({
            "mood": detected_mood,
            "confidence": round(confidence, 2),
            "detected_emotion": emotion_label
        })
        
    except Exception as e:
        print(f"Error in AI mood detection: {str(e)}")
        return json.dumps({"mood": "neutral", "error": str(e)})

# Create clean Gradio interface
demo = gr.Interface(
    fn=detect_mood_ai,
    inputs=[gr.Textbox(
        label="How are you feeling?", 
        placeholder="Tell me about your day or how you're feeling...",
        lines=2
    )],
    outputs=gr.JSON(label="Detected Mood"),
    title="Moodify - AI Mood Detection",
    description="Powered by Hartmann's emotion classification model for accurate mood detection.",
    theme=gr.themes.Soft(),
    allow_flagging="never",
)

if __name__ == "__main__":
    demo.launch()
