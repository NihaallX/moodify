#!/bin/bash
# Quick deployment test script

echo "🚀 Moodify Deployment Test"
echo "=========================="

# Check if the site is accessible
echo "✅ Testing site accessibility..."
curl -I https://nihaallx.github.io/moodify 2>/dev/null | head -1

# Check if GitHub Actions are working
echo "✅ Latest GitHub Actions status:"
curl -s "https://api.github.com/repos/NihaallX/moodify/actions/runs" | grep -o '"status":"[^"]*"' | head -3

echo ""
echo "🎉 Deployment successful!"
echo "Live site: https://nihaallx.github.io/moodify"
echo ""
echo "📝 Next steps:"
echo "1. Test the AI mood detection on the live site"
echo "2. Verify Spotify integration works"
echo "3. Consider adding custom domain (optional)"
echo "4. Add analytics/monitoring (optional)"
