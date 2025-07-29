# PowerShell script to start the Team Pulse Dashboard development server
Write-Host "🚀 Starting Team Pulse Dashboard..." -ForegroundColor Green
Write-Host "📍 Setting up environment..." -ForegroundColor Yellow

# Set the port to avoid conflicts
$env:PORT=3002

# Start the development server
Write-Host "🌐 Starting development server on port 3002..." -ForegroundColor Cyan
npm run dev

Write-Host "✅ Development server should be running!" -ForegroundColor Green
Write-Host "🌐 Open your browser and go to: http://localhost:3002" -ForegroundColor Magenta 