# Moodify 🎵

A mood-based music recommendation web application that suggests Spotify playlists based on your current emotional state using AI-powered emotion detection.

(![moodify-logo png](https://github.com/user-attachments/assets/ec1a7b94-b088-493f-9383-cf19d57691e6)

## Features

- **Mood Detection**: Input your mood via text or an emoji slider
- **Spotify Integration**: Connect to your Spotify account for personalized recommendations
- **Playlist Recommendation**: Get Spotify playlists that match your current mood
- **Emotional Messages**: Receive supportive or celebratory messages based on your mood
- **Simple, Clean UI**: Easy-to-use interface with no unnecessary complexity
- **Secure Authentication**: Using PKCE flow for enhanced security

## Tech Stack

- **Frontend**: React with plain CSS
- **External APIs**: Prepared for Spotify API integration
- **Mood Detection**: 
  - Emoji Slider: Simple valence-arousal mood mapping
  - AI Chat: Uses Mistral-based sentiment analysis (experimental)

## AI Mood Detection

This application now features advanced AI-powered mood detection using the Hartmann emotion-english-distilroberta-base model (DistilBERT for Emotion Classification). The AI can detect multiple emotions from text input with high accuracy.

### Supported Emotions
- Joy / Happiness
- Sadness
- Anger
- Fear
- Surprise
- Disgust / Contempt
- And more nuanced emotional states

### Environment Variables

For local development, copy `.env.example` to `.env` and add your tokens:

```bash
cp .env.example .env
```

Then edit `.env` and add your Hugging Face API token:
```
REACT_APP_HUGGINGFACE_TOKEN=your_huggingface_token_here
```

You can get a free Hugging Face API token from [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).

## Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow:

1. **Triggers**: On push to `master` branch or manual workflow dispatch
2. **Build**: Installs dependencies and builds the React app with environment variables
3. **Deploy**: Uses official GitHub Pages actions for secure deployment

### GitHub Pages Setup

The repository is configured for GitHub Pages deployment:
- **Source**: GitHub Actions
- **Custom Domain**: Not configured (uses default GitHub Pages URL)
- **Environment Variables**: Stored as GitHub repository secrets

### Environment Variables for Production

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `REACT_APP_HUGGINGFACE_TOKEN`: Your Hugging Face API token

## Getting Started

### Prerequisites

- Node.js and npm

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/moodify.git
   cd moodify
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Spotify API Integration

Moodify now integrates with the Spotify API using the PKCE (Proof Key for Code Exchange) authentication flow for enhanced security. To set up:

1. Create a Spotify Developer account at [https://developer.spotify.com](https://developer.spotify.com)
2. Register a new application in the Spotify Developer Dashboard:
   - Set your redirect URI to `https://nihaallx.github.io/moodify/` (with trailing slash, Spotify requires HTTPS for security reasons)
   - Request the following scopes: `user-read-private`, `user-read-email`, `playlist-read-private`, `playlist-read-collaborative`, `user-top-read`, `user-read-recently-played`, `user-library-read`

3. Update the `clientId` in `src/services/spotifyService.js` with your Client ID

4. Authenticate with Spotify by clicking the "Connect with Spotify" button in the app

The PKCE flow offers several advantages:
- More secure than Implicit Grant (no client secret needed in frontend)
- Supports refresh tokens for longer sessions
- Better user experience with automatic token refreshing

## Future Enhancements

- User authentication
- History of mood tracking
- More sophisticated mood detection
- Dynamic playlist generation
- Mobile app version

## Credits

- Created as a prototype for mood-based music recommendations
- Uses Spotify's extensive playlist catalog

## Made with ❤️ by Nihal

## License

MIT
