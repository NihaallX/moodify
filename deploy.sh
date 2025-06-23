#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
npm run deploy

echo "Deployment complete! Your application should be live at:"
echo "https://nihaallx.github.io/moodify/"

echo "Make sure your Spotify app's redirect URI is set to:"
echo "https://nihaallx.github.io/moodify/"
echo "IMPORTANT: Include the trailing slash exactly as shown above!"
echo ""
echo "Note: When testing locally, the app will still redirect to the GitHub Pages URL"
echo "for authentication and then back to your local app. This is because Spotify"
echo "requires HTTPS for redirect URIs."
