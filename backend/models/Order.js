const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  dish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [orderItemSchema],
  
  // Order details
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  
  // Delivery information
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  
  // Order status and tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Tracking information
  tracking: {
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    driverLocation: locationSchema,
    deliveryPath: [locationSchema],
    lastLocationUpdate: Date
  },
  
  // Driver information
  driver: {
    name: String,
    phone: String,
    vehicleNumber: String,
    rating: Number
  },
  
  // Payment information (placeholder for future integration)
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'digital_wallet', 'upi'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String
  },
  
  // Timestamps
  orderPlacedAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  preparingAt: Date,
  readyAt: Date,
  pickedUpAt: Date,
  deliveredAt: Date,
  
  // Additional information
  specialInstructions: String,
  contactPhone: {
    type: String,
    required: true
  },
  
  // Restaurant location for distance calculation
  restaurantLocation: {
    latitude: Number,
    longitude: Number
  }
}, {
  timestamps: true
});

// Generate unique order ID
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    this.orderId = `ORD${timestamp}${randomNum}`;
  }
  next();
});

// Calculate estimated delivery time based on distance
orderSchema.methods.calculateEstimatedDeliveryTime = function() {
  const baseTime = 30; // 30 minutes base delivery time
  const prepTime = 15; // 15 minutes preparation time
  
  if (this.deliveryAddress.coordinates && this.restaurantLocation) {
    const distance = this.calculateDistance(
      this.restaurantLocation.latitude,
      this.restaurantLocation.longitude,
      this.deliveryAddress.coordinates.latitude,
      this.deliveryAddress.coordinates.longitude
    );
    
    // Add 2 minutes per km
    const additionalTime = Math.ceil(distance) * 2;
    const totalTime = prepTime + baseTime + additionalTime;
    
    this.tracking.estimatedDeliveryTime = new Date(Date.now() + totalTime * 60000);
  } else {
    this.tracking.estimatedDeliveryTime = new Date(Date.now() + (baseTime + prepTime) * 60000);
  }
};

// Calculate distance between two coordinates using Haversine formula
orderSchema.methods.calculateDistance = function(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// Update driver location
orderSchema.methods.updateDriverLocation = function(latitude, longitude, address) {
  this.tracking.driverLocation = {
    latitude,
    longitude,
    address,
    timestamp: new Date()
  };
  this.tracking.lastLocationUpdate = new Date();
  
  // Add to delivery path
  this.tracking.deliveryPath.push({
    latitude,
    longitude,
    address,
    timestamp: new Date()
  });
};

// Update order status with timestamp
orderSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  const now = new Date();
  switch(newStatus) {
    case 'confirmed':
      this.confirmedAt = now;
      this.calculateEstimatedDeliveryTime();
      break;
    case 'preparing':
      this.preparingAt = now;
      break;
    case 'ready':
      this.readyAt = now;
      break;
    case 'out_for_delivery':
      this.pickedUpAt = now;
      break;
    case 'delivered':
      this.deliveredAt = now;
      this.tracking.actualDeliveryTime = now;
      break;
  }
};

// Index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'tracking.lastLocationUpdate': -1 });

module.exports = mongoose.model('Order', orderSchema);