# Hugging Face Space Setup Check

To ensure your Hugging Face Space is correctly configured to use the full AI model version, follow these steps:

## 1. Check your current Space deployment

Visit your Space at: https://huggingface.co/spaces/Leofrmamzn/moodify-mood-detection

## 2. Verify the model being used

Look at the logs and outputs in your Space to confirm whether it's using the full Mistral model or the lite version.

## 3. Update your Space to use the full AI model

If your Space is using the lite version, update it by:

1. Go to the "Files" tab in your Space
2. Rename the current `app.py` to `app_lite.py` (or delete it if you already have a backup)
3. Upload the full model version of `app.py` from your local `gradio_app/app.py`
4. Make sure your requirements.txt includes:

```
gradio==4.11.0
torch==2.1.2
transformers==4.36.2
accelerate==0.25.0
```

## Important considerations

- The full Mistral model requires significantly more resources and will be slower to load (could take several minutes on first use)
- You might need to upgrade to a paid hardware tier on Hugging Face for better performance
- If the model fails to load due to memory constraints, you may need to use a smaller model like "distilbert-base-uncased" instead

## Checking the API endpoint

After updating your Space, test the API integration with:

1. Open this URL in your browser (replacing YOUR_MESSAGE with an actual message):
   `https://huggingface.co/spaces/Leofrmamzn/moodify-mood-detection/+/api/predict?data=["YOUR_MESSAGE"]`

2. If working correctly, it should return a JSON response like: 
   `{"data": ["{\"mood\": \"happy\"}"], "is_generating": false, "duration": 5.43, "average_duration": 5.43}`
