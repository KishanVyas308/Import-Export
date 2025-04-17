#!/bin/bash

# Configuration
BOT_TOKEN="8101675713:AAGhh8ZjpqxhpphUkaXVyDgStZ5FCVecXqA"
CHAT_ID="5048770111"  # Replace with your actual chat ID

send_telegram_message() {
    MESSAGE=$1
    curl -s -X POST "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
        -d "chat_id=$CHAT_ID" \
        -d "text=$MESSAGE"
}

# Navigate to the project directory
cd /home/udhyog/ImportExport/management-sheet || exit

# Fetch latest changes
git fetch origin
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$CURRENT_BRANCH" = "main" ]; then
    send_telegram_message "🚀 Deployment started on main branch..."

    git reset --hard origin/main
    git pull origin main

    # Install dependencies
    npm install

    # Restart frontend and backend using PM2
    pm2 restart all

    if [ $? -eq 0 ]; then
        send_telegram_message "✅ Deployment completed successfully!"
    else
        send_telegram_message "❌ Deployment failed! Check logs for details."
    fi
else
    send_telegram_message "⚠️ Skipping deployment: Not on main branch."
fi