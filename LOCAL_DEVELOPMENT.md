# Local Development Guide

When developing the Moodify application locally, there are a few things to keep in mind regarding Spotify authentication:

## Spotify Authentication in Development Mode

The Spotify API requires HTTPS for redirect URIs, which presents a challenge for local development using standard `http://localhost` URLs. To address this, our application is configured to use the production redirect URI (`https://nihaallx.github.io/moodify/callback`) even during local development.

### How it works:

1. When you click "Connect with Spotify" in development mode, you'll be redirected to the Spotify authorization page.
2. After authorization, Spotify will redirect back to the GitHub Pages URL.
3. To test locally, you need to copy the authorization code from the GitHub Pages URL and manually paste it in your local app.

### Development Testing Workflow:

1. Start the local development server with `npm start`
2. Click "Connect with Spotify" in your local app
3. Authorize the application on Spotify's page
4. After authorization, you'll be redirected to GitHub Pages
5. Copy the authorization code from the URL (the value after `?code=` and before `&state=`)
6. Manually create a URL in your local environment with that code:
   ```
   http://localhost:3000/#/callback?code=YOUR_COPIED_CODE&state=YOUR_STATE_VALUE
   ```
7. Navigate to that URL in your browser

## Alternative Setup: HTTPS in Local Development

If you want a seamless local development experience, you can set up HTTPS for your local development server:

1. Generate a self-signed SSL certificate
2. Configure Create React App to use HTTPS
3. Update the `redirectUri` in `spotifyService.js` to use `https://localhost:3000/callback`
4. Add `https://localhost:3000/callback` to the allowed redirect URIs in your Spotify Developer Dashboard

For more details on setting up HTTPS locally, see:
https://create-react-app.dev/docs/using-https-in-development/
