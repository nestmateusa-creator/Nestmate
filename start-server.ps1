# NestMate Payment Server Startup Script
Write-Host "Starting NestMate Payment Server..." -ForegroundColor Green

# Set the working directory
Set-Location -Path "server"

# Add Node.js to PATH for this session
$env:PATH += ";C:\Program Files\nodejs"

# Check if Node.js is available
try {
    $nodeVersion = & node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Node.js not found in PATH. Using full path..." -ForegroundColor Yellow
    $nodePath = "C:\Program Files\nodejs\node.exe"
    if (Test-Path $nodePath) {
        Write-Host "Found Node.js at: $nodePath" -ForegroundColor Green
    } else {
        Write-Host "Node.js not found at expected location!" -ForegroundColor Red
        Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Start the server
Write-Host "Starting payment server on port 3001..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

try {
    & node payment-server.js
} catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
}


