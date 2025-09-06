@echo off
echo ========================================
echo    NextMate App - Netlify Deployment
echo ========================================
echo.

echo Step 1: Installing Netlify CLI...
call npm install -g netlify-cli

echo.
echo Step 2: Logging into Netlify...
echo Please follow the browser login process when it opens...
call netlify login

echo.
echo Step 3: Deploying to Netlify...
call netlify deploy --prod

echo.
echo ========================================
echo    Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Go to your Netlify dashboard
echo 2. Add custom domain: www.nestmateusa.com
echo 3. Set environment variables
echo 4. Test your site
echo.
pause
