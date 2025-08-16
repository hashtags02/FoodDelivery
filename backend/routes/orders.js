const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');

// @route   GET /api/orders
// @desc    Get user's orders with tracking info
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant', 'name address phone')
      .populate('items.dish', 'name price image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/orders
// @desc    Create order with Vadodara delivery validation
// @access  Private
router.post('/', [
  auth,
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('deliveryAddress.street').notEmpty().withMessage('Street address is required'),
  body('deliveryAddress.city').equals('Vadodara').withMessage('Delivery only available in Vadodara'),
  body('deliveryAddress.coordinates.latitude').isFloat().withMessage('Valid latitude required'),
  body('deliveryAddress.coordinates.longitude').isFloat().withMessage('Valid longitude required'),
  body('paymentMethod').isIn(['cash', 'card', 'digital_wallet', 'upi']).withMessage('Invalid payment method'),
  body('contactPhone').isMobilePhone('en-IN').withMessage('Valid Indian mobile number required'),
  body('restaurantId').isMongoId().withMessage('Valid restaurant ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, deliveryAddress, paymentMethod, contactPhone, restaurantId, specialInstructions } = req.body;

    // Validate delivery location is within Vadodara limits
    const tempOrder = new Order({});
    if (!tempOrder.isWithinVadodaraLimits(deliveryAddress.coordinates.latitude, deliveryAddress.coordinates.longitude)) {
      return res.status(400).json({ error: 'Delivery address is outside Vadodara city limits' });
    }

    // Get restaurant details
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Validate and calculate order items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const dish = await Dish.findById(item.dishId);
      if (!dish) {
        return res.status(404).json({ error: `Dish with ID ${item.dishId} not found` });
      }

      const itemTotal = dish.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        dish: dish._id,
        quantity: item.quantity,
        price: dish.price
      });
    }

    // Calculate fees for Vadodara delivery
    const deliveryFee = subtotal > 300 ? 0 : 40; // Free delivery above ₹300
    const tax = subtotal * 0.05; // 5% GST
    const total = subtotal + deliveryFee + tax;

    // Create order
    const order = new Order({
      user: req.user.id,
      restaurant: restaurantId,
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryAddress,
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cash' ? 'pending' : 'pending'
      },
      contactPhone,
      specialInstructions,
      restaurantLocation: {
        latitude: restaurant.location?.latitude || 22.3072,
        longitude: restaurant.location?.longitude || 73.1812
      }
    });

    // Calculate estimated delivery time
    order.calculateEstimatedDeliveryTime();

    await order.save();

    // Populate for response
    await order.populate('restaurant', 'name address phone');
    await order.populate('items.dish', 'name price image');

    res.status(201).json({
      message: 'Order placed successfully',
      order,
      trackingInfo: {
        orderId: order.orderId,
        estimatedDeliveryTime: order.tracking.estimatedDeliveryTime,
        status: order.status
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order details with live tracking
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    })
    .populate('restaurant', 'name address phone location')
    .populate('items.dish', 'name price image');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Calculate real-time distance if driver location is available
    let distanceToDestination = null;
    if (order.tracking.driverLocation && order.status === 'out_for_delivery') {
      distanceToDestination = order.calculateDistance(
        order.tracking.driverLocation.latitude,
        order.tracking.driverLocation.longitude,
        order.deliveryAddress.coordinates.latitude,
        order.deliveryAddress.coordinates.longitude
      );
    }

    res.json({
      order,
      liveTracking: {
        currentLocation: order.tracking.driverLocation,
        estimatedArrival: order.tracking.estimatedDeliveryTime,
        distanceRemaining: distanceToDestination,
        deliveryPath: order.tracking.deliveryPath,
        lastUpdate: order.tracking.lastLocationUpdate
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Restaurant/Admin)
router.put('/:id/status', [
  auth,
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, driverInfo } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update status with automatic timestamp
    order.updateStatus(status);

    // If order is out for delivery, assign driver info
    if (status === 'out_for_delivery' && driverInfo) {
      order.driver = {
        name: driverInfo.name,
        phone: driverInfo.phone,
        vehicleNumber: driverInfo.vehicleNumber,
        rating: driverInfo.rating || 4.5
      };
    }

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order: {
        orderId: order.orderId,
        status: order.status,
        estimatedDeliveryTime: order.tracking.estimatedDeliveryTime,
        driver: order.driver
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/location
// @desc    Update driver location for live tracking
// @access  Private (Driver)
router.put('/:id/location', [
  auth,
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  body('address').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { latitude, longitude, address } = req.body;

    // Validate location is within Vadodara bounds
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!order.isWithinVadodaraLimits(latitude, longitude)) {
      return res.status(400).json({ error: 'Location is outside Vadodara delivery area' });
    }

    // Update driver location
    order.updateDriverLocation(latitude, longitude, address || 'Vadodara, Gujarat');
    await order.save();

    // Calculate updated ETA based on current location
    const distanceToDestination = order.calculateDistance(
      latitude,
      longitude,
      order.deliveryAddress.coordinates.latitude,
      order.deliveryAddress.coordinates.longitude
    );

    const updatedETA = new Date(Date.now() + (distanceToDestination * 2 * 60000)); // 2 minutes per km

    res.json({
      message: 'Location updated successfully',
      tracking: {
        currentLocation: order.tracking.driverLocation,
        distanceToDestination: distanceToDestination.toFixed(2),
        updatedETA: updatedETA,
        lastUpdate: order.tracking.lastLocationUpdate
      }
    });
  } catch (error) {
    console.error('Error updating driver location:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/tracking/:orderId
// @desc    Get live tracking by order ID (public endpoint for customer)
// @access  Public (with order ID validation)
router.get('/tracking/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate('restaurant', 'name address phone')
      .select('orderId status tracking deliveryAddress driver payment.method estimatedDeliveryTime');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Calculate real-time updates for Vadodara delivery
    let estimatedTimeRemaining = null;
    let distanceRemaining = null;

    if (order.tracking.driverLocation && order.status === 'out_for_delivery') {
      distanceRemaining = order.calculateDistance(
        order.tracking.driverLocation.latitude,
        order.tracking.driverLocation.longitude,
        order.deliveryAddress.coordinates.latitude,
        order.deliveryAddress.coordinates.longitude
      );

      // Calculate time based on Vadodara traffic conditions
      const baseSpeed = order.isPeakHour() ? 15 : 25; // km/h considering Vadodara traffic
      estimatedTimeRemaining = Math.ceil((distanceRemaining / baseSpeed) * 60); // minutes
    }

    res.json({
      orderId: order.orderId,
      status: order.status,
      restaurant: order.restaurant,
      driver: order.driver,
      tracking: {
        currentLocation: order.tracking.driverLocation,
        estimatedDeliveryTime: order.tracking.estimatedDeliveryTime,
        estimatedTimeRemaining: estimatedTimeRemaining,
        distanceRemaining: distanceRemaining ? distanceRemaining.toFixed(2) : null,
        deliveryPath: order.tracking.deliveryPath,
        lastUpdate: order.tracking.lastLocationUpdate
      },
      deliveryAddress: {
        street: order.deliveryAddress.street,
        city: order.deliveryAddress.city
      }
    });
  } catch (error) {
    console.error('Error fetching tracking info:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
