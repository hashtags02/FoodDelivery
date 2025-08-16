const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock order data for testing
const mockOrders = {
  'ORD1234567890': {
    orderId: 'ORD1234567890',
    status: 'out_for_delivery',
    restaurant: {
      name: 'Vadodara Delights Restaurant',
      location: {
        latitude: 22.3072,
        longitude: 73.1812
      },
      address: 'Sayajigunj Main Road, Vadodara, Gujarat',
      phone: '+91 265 123 4567'
    },
    deliveryAddress: {
      street: 'Alkapuri Society, Block A, Flat 304',
      city: 'Vadodara',
      state: 'Gujarat',
      coordinates: {
        latitude: 22.2950,
        longitude: 73.2020
      }
    },
    driver: {
      name: 'Rahul Patel',
      phone: '+91 98765 43210',
      vehicleNumber: 'GJ-06-AB-1234',
      rating: 4.8
    },
    tracking: {
      currentLocation: {
        latitude: 22.3010 + (Math.random() - 0.5) * 0.005, // Simulate movement
        longitude: 73.1900 + (Math.random() - 0.5) * 0.005,
        address: 'Moving towards Alkapuri, Vadodara',
        timestamp: new Date().toISOString()
      },
      estimatedDeliveryTime: new Date(Date.now() + 15 * 60000).toISOString(),
      estimatedTimeRemaining: 12 + Math.floor(Math.random() * 6), // 12-18 minutes
      distanceRemaining: (2.1 + Math.random() * 0.8).toFixed(1), // 2.1-2.9 km
      deliveryPath: [
        {
          latitude: 22.3072,
          longitude: 73.1812,
          address: 'Restaurant - Sayajigunj',
          timestamp: new Date(Date.now() - 10 * 60000).toISOString()
        },
        {
          latitude: 22.3045,
          longitude: 73.1850,
          address: 'Sayajigunj Circle',
          timestamp: new Date(Date.now() - 8 * 60000).toISOString()
        },
        {
          latitude: 22.3010,
          longitude: 73.1900,
          address: 'Current Location - En route',
          timestamp: new Date().toISOString()
        }
      ],
      lastUpdate: new Date().toISOString()
    }
  },
  'ORD9876543210': {
    orderId: 'ORD9876543210',
    status: 'preparing',
    restaurant: {
      name: 'Gujarati Thali House',
      location: {
        latitude: 22.3183,
        longitude: 73.1733
      },
      address: 'Fatehgunj, Vadodara, Gujarat',
      phone: '+91 265 987 6543'
    },
    deliveryAddress: {
      street: 'Manjalpur Township, Building 7',
      city: 'Vadodara',
      state: 'Gujarat',
      coordinates: {
        latitude: 22.2707,
        longitude: 73.1981
      }
    },
    tracking: {
      estimatedDeliveryTime: new Date(Date.now() + 35 * 60000).toISOString(),
      estimatedTimeRemaining: 35,
      distanceRemaining: null
    }
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test tracking server is running',
    timestamp: new Date().toISOString(),
    availableOrders: Object.keys(mockOrders)
  });
});

// Get tracking data by order ID
app.get('/api/orders/tracking/:orderId', (req, res) => {
  const { orderId } = req.params;
  
  console.log(`📍 Tracking request for order: ${orderId}`);
  
  if (!mockOrders[orderId]) {
    return res.status(404).json({ 
      error: 'Order not found',
      message: `Order ${orderId} does not exist in test data`,
      availableOrders: Object.keys(mockOrders)
    });
  }

  // Simulate real-time updates for out_for_delivery orders
  const order = { ...mockOrders[orderId] };
  
  if (order.status === 'out_for_delivery' && order.tracking.currentLocation) {
    // Slightly move the driver towards destination (simulate movement)
    const current = order.tracking.currentLocation;
    const destination = order.deliveryAddress.coordinates;
    
    // Move 10% closer to destination each time
    const moveRatio = 0.1;
    current.latitude += (destination.latitude - current.latitude) * moveRatio;
    current.longitude += (destination.longitude - current.longitude) * moveRatio;
    current.timestamp = new Date().toISOString();
    
    // Update estimated time (reduce by 1-2 minutes)
    order.tracking.estimatedTimeRemaining = Math.max(1, 
      order.tracking.estimatedTimeRemaining - (1 + Math.random())
    );
    
    // Update distance
    const distance = calculateDistance(
      current.latitude, current.longitude,
      destination.latitude, destination.longitude
    );
    order.tracking.distanceRemaining = distance.toFixed(1);
    
    // Add to delivery path
    order.tracking.deliveryPath.push({
      latitude: current.latitude,
      longitude: current.longitude,
      address: 'Updated location',
      timestamp: current.timestamp
    });
    
    // Keep only last 10 path points
    if (order.tracking.deliveryPath.length > 10) {
      order.tracking.deliveryPath = order.tracking.deliveryPath.slice(-10);
    }
  }
  
  console.log(`✅ Returning tracking data for ${orderId}`);
  res.json(order);
});

// Update driver location (for testing)
app.put('/api/orders/:id/location', (req, res) => {
  const { id } = req.params;
  const { latitude, longitude, address } = req.body;
  
  console.log(`📍 Location update for order: ${id}`, { latitude, longitude, address });
  
  // Find order by MongoDB ID or orderId
  const order = Object.values(mockOrders).find(o => 
    o._id === id || o.orderId === id
  );
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  // Update location
  if (order.tracking) {
    order.tracking.currentLocation = {
      latitude,
      longitude,
      address: address || 'Updated location',
      timestamp: new Date().toISOString()
    };
    order.tracking.lastUpdate = new Date().toISOString();
  }
  
  res.json({
    message: 'Location updated successfully',
    tracking: order.tracking
  });
});

// Get all available test orders
app.get('/api/orders/test/available', (req, res) => {
  res.json({
    message: 'Available test orders',
    orders: Object.keys(mockOrders).map(orderId => ({
      orderId,
      status: mockOrders[orderId].status,
      restaurant: mockOrders[orderId].restaurant.name
    }))
  });
});

// Utility function to calculate distance
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/orders/tracking/:orderId',
      'GET /api/orders/test/available',
      'PUT /api/orders/:id/location'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Test Tracking Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test tracking: http://localhost:${PORT}/api/orders/tracking/ORD1234567890`);
  console.log(`📱 Available orders: http://localhost:${PORT}/api/orders/test/available`);
  console.log('\n🗺️  Ready for Google Maps testing!\n');
  
  // Display available test orders
  console.log('📋 Available Test Orders:');
  Object.keys(mockOrders).forEach(orderId => {
    const order = mockOrders[orderId];
    console.log(`   • ${orderId} - ${order.status} - ${order.restaurant.name}`);
  });
  console.log('\n');
});

module.exports = app;