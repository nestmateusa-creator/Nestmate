# NextMate App - Netlify Deployment Script
Write-Host "========================================" -ForegroundColor Green
Write-Host "    NextMate App - Netlify Deployment" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Installing Netlify CLI..." -ForegroundColor Yellow
npm install -g netlify-cli

Write-Host ""
Write-Host "Step 2: Logging into Netlify..." -ForegroundColor Yellow
Write-Host "Please follow the browser login process when it opens..." -ForegroundColor Cyan
netlify login

Write-Host ""
Write-Host "Step 3: Deploying to Netlify..." -ForegroundColor Yellow
netlify deploy --prod

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to your Netlify dashboard" -ForegroundColor White
Write-Host "2. Add custom domain: www.nestmateusa.com" -ForegroundColor White
Write-Host "3. Set environment variables" -ForegroundColor White
Write-Host "4. Test your site" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"

