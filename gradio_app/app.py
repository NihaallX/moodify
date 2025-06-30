import gradio as gr
import torch
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import re
import json

# Initialize the model and tokenizer
model_name = "mistralai/Mistral-7B-Instruct-v0.2"

# Create a text generation pipeline using Mistral 7B model
pipe = pipeline(
    "text-generation",
    model=model_name,
    torch_dtype=torch.bfloat16,
    device_map="auto",
)

# List of valid mood categories to ensure consistent output
VALID_MOODS = [
    "anxious", "calm", "happy", "sad", "energetic", 
    "study", "soothing", "angry", "focused", "neutral"
]

def extract_mood_from_text(text):
    """Simple rule-based mood extraction as backup strategy"""
    text = text.lower()
    
    # Keywords associated with different moods
    mood_keywords = {
        "anxious": ["anxious", "nervous", "worried", "stress", "panic", "fear"],
        "calm": ["calm", "peaceful", "relaxed", "serene", "tranquil"],
        "happy": ["happy", "joy", "cheerful", "excited", "glad", "pleased"],
        "sad": ["sad", "down", "unhappy", "miserable", "depressed", "gloomy"],
        "energetic": ["energy", "energetic", "pumped", "active", "vigorous"],
        "study": ["study", "focus", "concentration", "homework", "learning"],
        "soothing": ["soothe", "comfort", "gentle", "soft", "relax", "sleep"],
        "angry": ["angry", "mad", "furious", "rage", "annoyed", "irritated"],
        "focused": ["focused", "determined", "resolute", "committed", "attentive"]
    }
    
    # Count keyword matches for each mood
    mood_scores = {}
    for mood, keywords in mood_keywords.items():
        score = sum(1 for keyword in keywords if keyword in text)
        mood_scores[mood] = score
    
    # Return the mood with the highest score, or neutral if no matches
    max_score = max(mood_scores.values()) if mood_scores else 0
    if max_score > 0:
        return max(mood_scores.items(), key=lambda x: x[1])[0]
    return "neutral"

def analyze_mood(user_message):
    """
    Process the user message and extract the mood using the Mistral model
    Returns the detected mood as a JSON string
    """
    if not user_message or not user_message.strip():
        return json.dumps({"mood": "neutral"})
    
    # Create a prompt for the model that specifies the task
    prompt = f"""<s>[INST] You are an emotion detection AI. 
Based on the following message, determine the dominant emotional state or mood of the person.
Choose ONE mood from this list: anxious, calm, happy, sad, energetic, study, soothing, angry, focused, neutral.
Only respond with a JSON object containing the mood, like: {{"mood": "happy"}}

User message: "{user_message}" [/INST]"""

    try:
        # Generate a response from the model
        response = pipe(
            prompt,
            max_new_tokens=50,
            temperature=0.1,  # Low temperature for more deterministic output
            do_sample=True,
            top_p=0.95,
        )[0]["generated_text"]
        
        # Extract just the model's response (after the prompt)
        model_response = response.split("[/INST]")[-1].strip()
        
        # Try to parse JSON from the response
        try:
            # Look for JSON pattern in the response
            json_match = re.search(r'({.*?})', model_response, re.DOTALL)
            if json_match:
                json_str = json_match.group(1)
                result = json.loads(json_str)
                
                # Ensure the result has a mood field
                if "mood" in result:
                    mood = result["mood"].lower()
                    # Validate that it's one of our defined moods
                    if mood in VALID_MOODS:
                        return json.dumps({"mood": mood})
        except:
            pass
        
        # Fallback: try to extract mood using keyword analysis
        fallback_mood = extract_mood_from_text(user_message)
        return json.dumps({"mood": fallback_mood})
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return json.dumps({"mood": "neutral", "error": "Failed to process the message"})

# Create Gradio Interface
demo = gr.Interface(
    fn=analyze_mood,
    inputs=[gr.Textbox(label="How are you feeling?", placeholder="Tell me about your day or how you're feeling...")],
    outputs=gr.JSON(label="Detected Mood"),
    title="Moodify - Mood Detection",
    description="Share how you're feeling and I'll detect your mood.",
    theme=gr.themes.Soft(),
    allow_flagging="never",
)

# Launch the app
demo.launch()
