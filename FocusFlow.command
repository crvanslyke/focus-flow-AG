#!/bin/bash

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Go to that directory
cd "$DIR"

# Check if node_modules exists, if not, explaining they need to install first
if [ ! -d "node_modules" ]; then
    echo "⚠️  First run detected. Installing dependencies... (this happens only once)"
    npm install
fi

# Start the preview server in the background
# We use 'preview' instead of 'dev' for a cleaner production-like build
# First, ensure build exists
if [ ! -d "dist" ]; then
    echo "Building app..."
    npm run build
fi

echo "🚀 Starting FocusFlow..."
npm run preview > /dev/null 2>&1 &
PID=$!

# Wait a moment for server to start
sleep 2

# Open in default browser
open "http://localhost:4173"

# Keep script running to keep server alive
echo "✅ App is running! You can close this window when you are done."
echo "   (Server process ID: $PID)"
wait $PID
