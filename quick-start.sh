#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗺️  Vadodara Food Delivery - Google Maps Live Tracking${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if .env file exists and has API key
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created. Please add your Google Maps API key!${NC}"
    echo ""
fi

# Check if API key is set
if grep -q "your_google_maps_api_key_here\|AIzaSyDeveloperKey_REPLACE_WITH_YOUR_ACTUAL_KEY" .env; then
    echo -e "${YELLOW}⚠️  Google Maps API Key Setup Required!${NC}"
    echo ""
    echo -e "${PURPLE}📋 Quick Setup Steps:${NC}"
    echo -e "1. Visit: ${BLUE}https://console.cloud.google.com/${NC}"
    echo -e "2. Create new project: 'Vadodara Food Delivery'"
    echo -e "3. Enable APIs: Maps JavaScript API, Places API, Geocoding API"
    echo -e "4. Create API Key in 'Credentials'"
    echo -e "5. Update .env file with your API key"
    echo ""
    echo -e "${YELLOW}Press Enter when you've added your API key to .env file...${NC}"
    read -r
fi

echo -e "${GREEN}🚀 Starting the tracking system...${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

# Function to start backend server
start_backend() {
    echo -e "${BLUE}🔧 Starting backend test server...${NC}"
    cd backend 2>/dev/null || {
        echo -e "${YELLOW}📁 Backend directory not found, using test server...${NC}"
        node test-tracking-server.js &
        BACKEND_PID=$!
        return
    }
    
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
        npm install
    fi
    
    # Try to start the main server, fallback to test server
    if [ -f "server.js" ]; then
        npm run dev &
        BACKEND_PID=$!
    else
        cd ..
        node backend/test-tracking-server.js &
        BACKEND_PID=$!
    fi
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}🎨 Starting frontend development server...${NC}"
    npm start &
    FRONTEND_PID=$!
}

# Start backend
start_backend
sleep 2

# Start frontend  
start_frontend
sleep 3

echo ""
echo -e "${GREEN}✅ Both servers are starting up!${NC}"
echo ""
echo -e "${PURPLE}📱 Testing URLs:${NC}"
echo -e "• Frontend: ${BLUE}http://localhost:3000${NC}"
echo -e "• Tracking: ${BLUE}http://localhost:3000/track${NC}"
echo -e "• Backend API: ${BLUE}http://localhost:5000/api/health${NC}"
echo ""
echo -e "${PURPLE}🧪 Test Order IDs:${NC}"
echo -e "• ${YELLOW}ORD1234567890${NC} - Out for delivery (live tracking)"
echo -e "• ${YELLOW}ORD9876543210${NC} - Being prepared"
echo ""

# Function to open URLs
open_urls() {
    sleep 5
    echo -e "${GREEN}🌐 Opening test URLs...${NC}"
    
    # Try different commands to open browser based on OS
    if command -v xdg-open > /dev/null; then
        # Linux
        xdg-open "http://localhost:3000/track" 2>/dev/null &
        sleep 2
        xdg-open "http://localhost:5000/api/health" 2>/dev/null &
    elif command -v open > /dev/null; then
        # macOS
        open "http://localhost:3000/track" &
        sleep 2
        open "http://localhost:5000/api/health" &
    elif command -v start > /dev/null; then
        # Windows
        start "http://localhost:3000/track" &
        sleep 2
        start "http://localhost:5000/api/health" &
    else
        echo -e "${YELLOW}📖 Please manually open:${NC}"
        echo -e "   http://localhost:3000/track"
        echo -e "   http://localhost:5000/api/health"
    fi
}

# Open URLs in background
open_urls &

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Live tracking system is ready!${NC}"
echo ""
echo -e "${PURPLE}📝 How to test:${NC}"
echo -e "1. Visit: http://localhost:3000/track"
echo -e "2. Enter order ID: ${YELLOW}ORD1234567890${NC}"
echo -e "3. See live tracking on Google Maps (Vadodara)"
echo -e "4. Watch driver move in real-time!"
echo ""
echo -e "${YELLOW}💡 Features to test:${NC}"
echo -e "✓ Real-time driver location updates"
echo -e "✓ Vadodara city-specific map view"
echo -e "✓ Delivery route visualization"
echo -e "✓ Driver contact information"
echo -e "✓ ETA calculations for Vadodara traffic"
echo -e "✓ Mobile responsive design"
echo ""
echo -e "${RED}Press Ctrl+C to stop all servers${NC}"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    
    # Kill any remaining node processes on these ports
    pkill -f "node.*test-tracking-server" 2>/dev/null
    pkill -f "react-scripts start" 2>/dev/null
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user input
echo -e "${BLUE}Servers are running... Press Ctrl+C to stop${NC}"
while true; do
    sleep 1
done