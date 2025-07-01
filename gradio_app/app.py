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
            if any(word in text_lower for word in ["study", "homework", "learn", "focus"]):
                detected_mood = "study"
            elif any(word in text_lower for word in ["tired", "sleep", "relax", "comfort"]):
                detected_mood = "soothing"
            elif any(word in text_lower for word in ["calm", "peaceful", "zen"]):
                detected_mood = "calm"
        
        return json.dumps({
            "mood": detected_mood,
            "confidence": confidence,
            "detected_emotion": emotion_label
        })
        
    except Exception as e:
        print(f"Error in mood detection: {str(e)}")
        return json.dumps({"mood": "neutral", "error": str(e)})

# Create Gradio Interface with CORS enabled
demo = gr.Interface(
    fn=detect_mood_ai,
    inputs=[gr.Textbox(label="How are you feeling?", placeholder="Tell me about your day or how you're feeling...")],
    outputs=gr.JSON(label="Detected Mood"),
    title="Moodify - AI Mood Detection",
    description="Share how you're feeling and I'll detect your mood using advanced AI emotion recognition.",
    theme=gr.themes.Soft(),
    allow_flagging="never",
)

# Launch the app with CORS enabled
if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False
    )
