# Moodify 🎵

A mood-based music recommendation web application that suggests Spotify playlists based on your current emotional state.

![Moodify Banner](https://i.imgur.com/LTFxFOs.png)

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
- **Mood Detection**: Simple keyword matching (expandable to NLP/ML)

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
