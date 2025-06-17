# Moodify 🎵

A mood-based music recommendation web application that suggests Spotify playlists based on your current emotional state.

![Moodify Banner](https://i.imgur.com/LTFxFOs.png)

## Features

- **Mood Detection**: Input your mood via text or an emoji slider
- **Playlist Recommendation**: Get Spotify playlists that match your current mood
- **Emotional Messages**: Receive supportive or celebratory messages based on your mood
- **Simple, Clean UI**: Easy-to-use interface with no unnecessary complexity

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

To enable full functionality with the Spotify API:

1. Create a Spotify Developer account at [https://developer.spotify.com](https://developer.spotify.com)
2. Register a new application to get your Client ID
3. Update the `clientId` in `src/services/spotifyService.js` with your Client ID
4. Set your redirect URI in the Spotify Developer Dashboard to match the URI in the code

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
