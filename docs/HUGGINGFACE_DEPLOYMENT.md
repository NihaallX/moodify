# Moodify AI Integration Guide

This guide will help you deploy the Hugging Face Space for the Moodify AI chatbot integration.

## Step 1: Create a Hugging Face Account
1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up for an account or log in to an existing one

## Step 2: Create a New Space
1. Go to your profile and click on "New Space"
2. Choose "Gradio" as the SDK
3. Name your space "moodify-mood-detection" (or similar)
4. Choose "Public" for the visibility setting
5. Select "CPU" as the hardware (free tier is sufficient for this demo)

## Step 3: Upload Files
1. Clone your new space repository
2. Copy the contents of the `gradio_app` directory to your cloned repository
3. Push the changes to your Hugging Face Space repository

## Step 4: Update the API URL in Moodify
After your Hugging Face Space is deployed, update the API URL in `chatbotDetector.js` with your actual Space URL:

```javascript
// Example URL format: 
const apiUrl = 'https://yourusername-moodify-mood-detection.hf.space/api/predict';
```

Replace "yourusername" with your actual Hugging Face username.

## Step 5: Testing and Troubleshooting
1. You can test your Space directly on the Hugging Face interface
2. Check the deployment logs if you encounter any issues
3. Remember that the first request might be slow due to cold start times
4. Ensure you're handling timeouts and errors in the frontend code

## Notes on Model Performance
- The Mistral 7B model might be slow on free CPU instances
- Cold start times can be up to 1-2 minutes
- Consider reducing the model size or using smaller alternatives for production usage
