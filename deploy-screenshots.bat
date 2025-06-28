@echo off
echo === MOODIFY DEPLOY HELPER ===
echo.
echo This script will help you deploy your updated screenshots to GitHub Pages.
echo.

echo Step 1: Building the project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error building the project! Please check for errors above.
    pause
    exit /b 1
)

echo.
echo Step 2: Deploying to GitHub Pages...
call npm run deploy
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error deploying to GitHub Pages! Please check for errors above.
    pause
    exit /b 1
)

echo.
echo ✓ Success! Your Moodify app with new screenshots has been deployed.
echo Your friends can now visit: https://nihaallx.github.io/moodify/
echo.
pause
