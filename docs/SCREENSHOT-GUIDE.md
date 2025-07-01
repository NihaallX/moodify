# Moodify Screenshot Guide

This guide will help you add your screenshots to the Moodify landing page.

## Quick Start

1. **Take screenshots** of your Moodify app showing:
   - The emoji slider interface
   - The chat interface 
   - Mood analysis results
   - Playlist recommendations

2. **Save the screenshots** as:
   - `public/images/screenshots/emoji-slider.png`
   - `public/images/screenshots/chat-interface.png`
   - `public/images/screenshots/`mood-analysis.png`
   - `public/images/screenshots/`playlist-view.png`

3. **Deploy the changes** by running:
   ```
   npm run build
   npm run deploy
   ```
   
## Helper Files

To make this easier, this folder contains:

- `screenshot-guide.html` - Open this in your browser for a visual guide
- `create-placeholders.bat` - Creates empty placeholder PNG files (already run)
- `deploy-screenshots.bat` - Builds and deploys your app after you add screenshots

## Screenshots Folder Structure

The screenshots should be placed in:

```
/public/images/screenshots/
```

## Screenshot Dimensions

Recommended dimensions:
- Width: 800px or more
- Height: 500px or more
- Aspect ratio: 16:10 or 16:9 works well

## How to Deploy

After replacing the placeholder images with your real screenshots:

1. Run `npm run build` to build the app
2. Run `npm run deploy` to deploy to GitHub Pages

Or simply run the `deploy-screenshots.bat` file which does both steps.

## Landing Page URL

Your friends can access the landing page at:
https://nihaallx.github.io/moodify/

From there, they can click "Try Moodify" or "Launch App" to use the main app.
