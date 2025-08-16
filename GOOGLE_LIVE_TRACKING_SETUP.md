# Google Live Tracking Setup for Vadodara Food Delivery

## Overview
This implementation provides real-time order tracking using Google Maps API, specifically optimized for food delivery in Vadodara city, Gujarat. The system includes live driver location updates, estimated delivery times considering Vadodara traffic patterns, and delivery area validation.

## Features

### 🗺️ Real-time Map Tracking
- Live driver location updates every 30 seconds
- Google Maps integration with custom Vadodara styling
- Delivery route visualization with path history
- Restaurant and delivery location markers

### ⏱️ Vadodara-Optimized Delivery
- Traffic-aware ETA calculations for Vadodara roads
- Peak hour detection (12-2 PM, 7-9 PM IST)
- Delivery zone validation (Central, Sayajigunj, Alkapuri, etc.)
- Distance-based delivery fee calculation

### 📱 User Experience
- Responsive design for mobile and desktop
- Real-time status updates
- Driver contact information
- Order progress timeline

## Setup Instructions

### 1. Google Maps API Configuration

#### Step 1: Get Google Maps API Key
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API

#### Step 2: Configure API Key
1. Create API key with restrictions:
   - Application restrictions: HTTP referrers
   - Add your domain (e.g., `yourdomain.com/*`)
   - API restrictions: Select only the enabled APIs above

#### Step 3: Environment Setup
1. Copy `.env.example` to `.env`
2. Add your API key:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

### 2. Backend Setup

#### Step 1: Install Dependencies
```bash
cd backend
npm install
```

#### Step 2: Database Setup
The Order model is already created with tracking fields. Make sure MongoDB is running:
```bash
# Start MongoDB
mongod

# Or if using MongoDB service
sudo systemctl start mongod
```

#### Step 3: Start Backend Server
```bash
cd backend
npm run dev
```

### 3. Frontend Setup

#### Step 1: Install Dependencies
```bash
npm install
```

#### Step 2: Start Development Server
```bash
npm start
```

### 4. Testing the Tracking System

#### Access Tracking Interface
1. Navigate to `http://localhost:3000/track`
2. Use sample order ID: `ORD1234567890`
3. Or create a new order and use the generated order ID

## API Endpoints

### Order Tracking Endpoints

#### Get Live Tracking
```
GET /api/orders/tracking/:orderId
```
Returns real-time tracking information including driver location, ETA, and delivery status.

#### Update Driver Location
```
PUT /api/orders/:id/location
```
Updates driver's current location (used by driver app/admin).

#### Update Order Status
```
PUT /api/orders/:id/status
```
Updates order status with automatic timestamp tracking.

#### Create Order
```
POST /api/orders
```
Creates new order with Vadodara delivery validation.

## Vadodara Configuration

### Delivery Zones
```javascript
DELIVERY_ZONES: [
  {
    name: "Central Vadodara",
    center: { lat: 22.3072, lng: 73.1812 },
    radius: 3, // km
    deliveryFee: 0,
    estimatedTime: 20 // minutes
  },
  {
    name: "Sayajigunj Area",
    center: { lat: 22.3056, lng: 73.1897 },
    radius: 2,
    deliveryFee: 20,
    estimatedTime: 25
  },
  {
    name: "Alkapuri Area",
    center: { lat: 22.2950, lng: 73.2020 },
    radius: 2,
    deliveryFee: 20,
    estimatedTime: 30
  },
  {
    name: "Outer Vadodara",
    center: { lat: 22.3072, lng: 73.1812 },
    radius: 8,
    deliveryFee: 40,
    estimatedTime: 45
  }
]
```

### City Boundaries
```javascript
VADODARA_BOUNDS: {
  north: 22.4000,
  south: 22.2000,
  east: 73.3000,
  west: 73.0500
}
```

### Traffic Patterns
- **Peak Hours**: 12-2 PM, 7-9 PM IST
- **Normal Speed**: 25 km/h
- **Peak Hour Speed**: 15 km/h
- **Base Delivery Time**: 25 minutes + travel time

## Usage Examples

### Customer Order Tracking
```javascript
// Access tracking page
http://localhost:3000/track/ORD1234567890

// Or search by order ID
http://localhost:3000/track
```

### Driver Location Update (API)
```javascript
PUT /api/orders/ORDER_ID/location
{
  "latitude": 22.3072,
  "longitude": 73.1812,
  "address": "Sayajigunj, Vadodara"
}
```

### Order Status Update
```javascript
PUT /api/orders/ORDER_ID/status
{
  "status": "out_for_delivery",
  "driverInfo": {
    "name": "Rahul Patel",
    "phone": "+91 98765 43210",
    "vehicleNumber": "GJ-06-AB-1234",
    "rating": 4.8
  }
}
```

## File Structure

```
src/
├── components/
│   ├── OrderTracking.js          # Main tracking component
│   ├── OrderTracking.css         # Tracking styles
│   └── Navbar.js                 # Updated with tracking link
├── pages/
│   ├── TrackingPage.js           # Tracking page wrapper
│   └── TrackingPage.css          # Page styles
├── config/
│   └── googleMaps.js             # Vadodara-specific configuration
└── App.js                        # Updated routes

backend/
├── models/
│   └── Order.js                  # Order model with tracking
└── routes/
    └── orders.js                 # Order API with tracking endpoints
```

## Customization

### Modify Delivery Areas
Edit `src/config/googleMaps.js`:
```javascript
DELIVERY_ZONES: [
  // Add or modify delivery zones
  {
    name: "New Area",
    center: { lat: YOUR_LAT, lng: YOUR_LNG },
    radius: RADIUS_KM,
    deliveryFee: FEE_AMOUNT,
    estimatedTime: TIME_MINUTES
  }
]
```

### Adjust Traffic Patterns
```javascript
// In Order model methods
const isPeakHour = (hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21);
const baseSpeed = isPeakHour ? 15 : 25; // Adjust speeds as needed
```

### Map Styling
Customize map appearance in `googleMaps.js`:
```javascript
mapStyles: [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }
  // Add more styling rules
]
```

## Troubleshooting

### Common Issues

#### 1. Map Not Loading
- Check Google Maps API key in `.env`
- Verify API is enabled in Google Cloud Console
- Check browser console for API errors

#### 2. Location Updates Not Working
- Ensure backend server is running
- Check API endpoints are accessible
- Verify database connection

#### 3. Delivery Area Validation Failing
- Check coordinates are within Vadodara bounds
- Verify latitude/longitude format
- Test with known Vadodara coordinates

### API Key Restrictions
Make sure your API key allows:
- HTTP referrers from your domain
- Maps JavaScript API
- Places API (for address geocoding)

## Production Deployment

### Environment Variables
```bash
REACT_APP_GOOGLE_MAPS_API_KEY=production_api_key
REACT_APP_API_URL=https://your-api-domain.com/api
```

### Security Considerations
1. Restrict API key to production domain
2. Enable HTTPS for all API calls
3. Implement rate limiting for tracking updates
4. Validate all location coordinates server-side

### Performance Optimization
1. Implement location update batching
2. Use WebSocket for real-time updates
3. Cache static map data
4. Optimize database queries with indexes

## Integration with Payment Gateway

When your friend completes the payment gateway on the `asmi` branch:

1. The order creation will integrate with payment processing
2. Tracking will start automatically after successful payment
3. Payment status will be reflected in order tracking

### Merge Considerations
- Order model includes payment status fields
- API endpoints are payment-gateway ready
- Frontend can display payment status in tracking

## Support

For issues specific to Vadodara delivery:
- Check delivery zone configuration
- Verify Vadodara coordinate boundaries
- Test with local Vadodara addresses

For Google Maps issues:
- Review API quotas and billing
- Check API key permissions
- Monitor API usage in Google Cloud Console