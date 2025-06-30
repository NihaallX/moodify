# Moodify Mood Detection API

This is a Gradio app that uses the Mistral-7B-Instruct-v0.2 model to detect a user's mood from text input. It's designed to be used as an API for the Moodify web application.

## How it works

The app takes a text input describing how a user is feeling and returns a JSON object containing the detected mood:

```json
{ "mood": "happy" }
```

Possible mood values are: anxious, calm, happy, sad, energetic, study, soothing, angry, focused, neutral.

## API Usage

The app can be used as an API endpoint. To call it from JavaScript:

```javascript
const response = await fetch("https://yourspace-username.hf.space/api/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    data: ["I'm feeling really excited about the weekend!"]
  })
});

const result = await response.json();
const mood = JSON.parse(result.data[0]).mood;
console.log("Detected mood:", mood);
```

## Deployment

This app is designed to be deployed on Hugging Face Spaces, which provides free compute resources for hosting machine learning demos and APIs.
