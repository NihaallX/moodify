# MOODIFY

> AI-powered mood detection → personalized song recommendations via Spotify

Live: **https://moodifyxd.vercel.app**

---

## What it does

Moodify reads your current vibe and surfaces songs that match. Two ways to express how you feel:

- **Emoji Slider** — drag across a spectrum of moods, pick intensity, choose genres
- **AI Chat** — describe your mood in plain text; a Groq LLM parses the context and returns a mood label + songs

Once a mood is detected, Moodify hits the Spotify Recommendations API and returns 8 songs with album art, a 30-second preview, and a direct link to Spotify.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v7 |
| AI / Mood detection | Groq API (`llama-3.3-70b-versatile`) |
| Music data | Spotify Web API (PKCE OAuth) |
| Styling | IBM Plex Mono + Montserrat, dark theme |
| Hosting | Vercel |

---

## Architecture

```
User Input
  ├── Emoji slider  →  MoodInput.js  →  mood string
  └── AI chat       →  ChatInput.js  →  groqDetector.js  →  mood string
                                              ↓
                                Groq: llama-3.3-70b-versatile
                                              ↓
                                mood label (happy / sad / energetic / calm /
                                            anxious / angry / study / soothing / focused)
                                              ↓
                                spotifyService.getSongsByMood()
                                              ↓
                                Spotify Recommendations API
                                (seed genres + seed tracks, shuffled, deduplicated)
                                              ↓
                                SongCard grid (album art, preview, open in Spotify)
```

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Spotify Developer](https://developer.spotify.com/dashboard) app with PKCE enabled
- A [Groq](https://console.groq.com) API key

### Install

```bash
git clone https://github.com/nihaallx/moodify
cd moodify
npm install
```

### Environment variables

Create `.env.local` in the project root:

```env
REACT_APP_GROQ_API_KEY=gsk_...
REACT_APP_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
HOST=127.0.0.1
```

Add `http://127.0.0.1:3000/callback` as a Redirect URI in your Spotify app dashboard.

### Run locally

```bash
npm start
```

App opens at `http://127.0.0.1:3000`.

---

## Project structure

```
src/
├── components/
│   ├── MoodInput.js / .css        # Emoji slider + genre picker
│   ├── InputSelector.js / .css    # Toggle between slider and chat
│   ├── ChatInput.js / .css        # AI chat interface
│   ├── SongCard.js / .css         # Individual song tile
│   ├── SongRecommendation.js/.css # Song grid + heading
│   ├── MoodMessage.js / .css      # Detected-mood display card
│   ├── SpotifyCallback.js         # OAuth callback handler
│   └── LocalDevAuth.js            # Dev-only Spotify auth shortcut
├── services/
│   ├── spotifyService.js          # Spotify API wrapper + mock data
│   └── groqDetector.js            # Groq LLM mood detection
├── App.js / App.css               # Root layout, header, Jack mascot
└── index.css                      # Global dark theme + grid background
public/
├── landing.html                   # Static landing page
├── jack-front.png                 # Jack mascot (floating bottom-right)
└── jack-ufo.png                   # Jack UFO footer asset
```

---

## Supported moods

`happy` · `sad` · `energetic` · `calm` · `anxious` · `angry` · `study` · `soothing` · `focused`

---

## Design

Dark theme inspired by the Jack alien mascot design system:
- Background: `#000000` with `rgba(192,132,252,0.05)` purple grid
- Accent: `#c084fc` (purple) + `#f472b6` (pink)
- Typography: IBM Plex Mono (mono) + Montserrat (display)
- Cards: `#111111` with `1px solid #2a2a2a` borders

---

## Made by Nihal

## License

MIT
