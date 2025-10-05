# AWS CLI Installation Script for Windows
# This script downloads and installs AWS CLI directly

Write-Host "🚀 Installing AWS CLI..." -ForegroundColor Green

# Download AWS CLI MSI installer
$url = "https://awscli.amazonaws.com/AWSCLIV2.msi"
$output = "$env:TEMP\AWSCLIV2.msi"

Write-Host "📥 Downloading AWS CLI installer..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $url -OutFile $output
    Write-Host "✅ Download completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Download failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Install AWS CLI
Write-Host "🔧 Installing AWS CLI..." -ForegroundColor Yellow
try {
    Start-Process msiexec.exe -Wait -ArgumentList "/i $output /quiet"
    Write-Host "✅ AWS CLI installation completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Installation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Clean up
Remove-Item $output -Force

# Refresh environment variables
Write-Host "🔄 Refreshing environment variables..." -ForegroundColor Yellow
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Test installation
Write-Host "🧪 Testing AWS CLI installation..." -ForegroundColor Yellow
try {
    $version = & aws --version 2>$null
    if ($version) {
        Write-Host "✅ AWS CLI installed successfully: $version" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Next steps:" -ForegroundColor Cyan
        Write-Host "1. Run: aws configure" -ForegroundColor White
        Write-Host "2. Enter your AWS Access Key ID" -ForegroundColor White
        Write-Host "3. Enter your AWS Secret Access Key" -ForegroundColor White
        Write-Host "4. Enter default region (us-east-1)" -ForegroundColor White
        Write-Host "5. Enter default output format (json)" -ForegroundColor White
    } else {
        Write-Host "⚠️  AWS CLI installed but may need a terminal restart" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  AWS CLI installed but may need a terminal restart" -ForegroundColor Yellow
    Write-Host "💡 Please restart your terminal and run: aws --version" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📋 To get your AWS credentials:" -ForegroundColor Cyan
Write-Host "1. Go to AWS Console → IAM → Users" -ForegroundColor White
Write-Host "2. Create a new user or use existing" -ForegroundColor White
Write-Host "3. Attach policy: AdministratorAccess" -ForegroundColor White
Write-Host "4. Create Access Key" -ForegroundColor White
Write-Host "5. Download credentials securely" -ForegroundColor White

