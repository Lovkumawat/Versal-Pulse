@echo off
echo 🚀 Starting Team Pulse Dashboard...
echo 📍 Setting up environment...

REM Set the port to avoid conflicts
set PORT=3002

REM Start the development server
echo 🌐 Starting development server on port 3002...
npm run dev

echo ✅ Development server should be running!
echo 🌐 Open your browser and go to: http://localhost:3002
pause 