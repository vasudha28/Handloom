const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Load environment variables
const path = require('path');
const result = require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Debug dotenv loading
if (result.error) {
  console.log('⚠️  .env file not found or error loading:', result.error.message);
  console.log('🔍 Looking for .env in:', path.join(__dirname, '../.env'));
  console.log('💡 Create a .env file in the backend directory with your environment variables');
} else {
  console.log('✅ .env file loaded successfully');
}

// Environment variables with fallbacks
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_RGj5ssTaXhQIDY';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '5T935CFBZojHBRvL3pa8beJX';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vasudhaoffsetprinters:Vasudha@cluster0.d1gijic.mongodb.net/handloom_portal?retryWrites=true&w=majority&appName=Cluster0';

// Debug environment variables
console.log('\n🔍 Environment Variables Debug:');
console.log('RAZORPAY_KEY_ID from env:', process.env.RAZORPAY_KEY_ID ? '✅ Set' : '❌ Not set');
console.log('RAZORPAY_KEY_SECRET from env:', process.env.RAZORPAY_KEY_SECRET ? '✅ Set' : '❌ Not set');
console.log('MONGODB_URI from env:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('Using RAZORPAY_KEY_ID:', RAZORPAY_KEY_ID);
console.log('Using MONGODB_URI:', MONGODB_URI);
console.log('');

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Handle preflight requests
app.options('*', cors());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

// Health check endpoint
app.get('/health', (req, res) => {
  const mongodbStatus = mongoose.connection.readyState;
  const mongodbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: {
      status: mongodbStates[mongodbStatus] || 'unknown',
      readyState: mongodbStatus
    },
    razorpay: {
      keyId: RAZORPAY_KEY_ID ? 'configured' : 'not configured'
    }
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    
    if (isConnected) {
      // Try to fetch a simple query
      const productCount = await Product.countDocuments();
      res.json({
        success: true,
        message: 'Database connection successful',
        productCount: productCount,
        mongodbState: mongoose.connection.readyState
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Database not connected',
        mongodbState: mongoose.connection.readyState
      });
    }
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message
    });
  }
});

// Razorpay create order
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order'
    });
  }
});

// Razorpay verify payment
app.post('/api/razorpay/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification data' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment verification failed'
    });
  }
});

// Get Razorpay key
app.get('/api/razorpay/key', (req, res) => {
  res.json({
    key: RAZORPAY_KEY_ID
  });
});

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body;
    
    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return res.status(400).json({
        success: false,
        error: 'Name, price, and category are required'
      });
    }

    // Create new product
    const product = new Product(productData);
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      product: savedProduct
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create product'
    });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      search
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const products = await Product.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch products'
    });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch product'
    });
  }
});

// Get product categories
app.get('/api/products/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch categories'
    });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const productData = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update product'
    });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete product'
    });
  }
});

// Export the app for Vercel
module.exports = app;
