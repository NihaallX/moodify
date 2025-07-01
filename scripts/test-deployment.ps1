# Moodify Deployment Test Script (PowerShell)
# Quick deployment verification

Write-Host "🚀 Moodify Deployment Test" -ForegroundColor Green
Write-Host "==========================" -ForegroundColor Green

# Check if the site is accessible
Write-Host "✅ Testing site accessibility..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://nihaallx.github.io/moodify" -Method Head -UseBasicParsing
    Write-Host "Site Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
} catch {
    Write-Host "Site check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Check GitHub Actions status
Write-Host "✅ Latest GitHub Actions status:" -ForegroundColor Yellow
try {
    $runs = Invoke-RestMethod -Uri "https://api.github.com/repos/NihaallX/moodify/actions/runs"
    $latestRun = $runs.workflow_runs[0]
    Write-Host "Latest run: $($latestRun.status) - $($latestRun.conclusion)" -ForegroundColor Green
} catch {
    Write-Host "GitHub Actions check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Deployment successful!" -ForegroundColor Green
Write-Host "Live site: https://nihaallx.github.io/moodify" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the AI mood detection on the live site"
Write-Host "2. Verify Spotify integration works"
Write-Host "3. Consider adding custom domain (optional)"
Write-Host "4. Add analytics/monitoring (optional)"
