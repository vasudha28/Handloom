const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Load environment variables
const path = require('path');
const result = require('dotenv').config({ path: path.join(__dirname, '.env') });

// Debug dotenv loading
if (result.error) {
  console.log('⚠️  .env file not found or error loading:', result.error.message);
  console.log('🔍 Looking for .env in:', path.join(__dirname, '.env'));
  console.log('💡 Create a .env file in the backend directory with your environment variables');
} else {
  console.log('✅ .env file loaded successfully');
}

// Environment variables with fallbacks - FIXED MONGODB_URI
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_RGj5ssTaXhQIDY';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '5T935CFBZojHBRvL3pa8beJX';
// FIXED: Changed to mongodb+srv and removed ssl=true
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
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow Vercel domains
    if (origin.includes('vercel.app') || origin.includes('vercel.com')) {
      return callback(null, true);
    }
    
    // Allow your production domain
    if (origin.includes('handloom1.vercel.app')) {
      return callback(null, true);
    }
    
    // Allow all origins in development, restrict in production
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Debug middleware
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path} from origin: ${req.headers.origin}`);
  
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  next();
});

// IMPROVED MongoDB connection with better error handling
async function connectToMongoDB() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // OpenSSL 3.0 compatible connection options
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      bufferCommands: false,
      // OpenSSL 3.0 compatibility - simplified TLS options
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false
    });

    console.log('✅ Connected to MongoDB');
    console.log('📊 Connection Details:');
    console.log('  - Host:', mongoose.connection.host);
    console.log('  - Port:', mongoose.connection.port);
    console.log('  - Database:', mongoose.connection.name);
    console.log('  - Ready State:', mongoose.connection.readyState);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('🔍 Error Details:');
    console.error('  - Error Name:', error.name);
    console.error('  - Error Code:', error.code);
    console.error('  - Error Message:', error.message);
    
    // Provide specific error guidance
    if (error.name === 'MongoServerSelectionError') {
      console.error('💡 Server Selection Error - Most likely causes:');
      console.error('  1. ❗ IP NOT WHITELISTED - Add your IP to MongoDB Atlas Network Access');
      console.error('  2. Check internet connection');
      console.error('  3. Verify MongoDB Atlas cluster is running');
      console.error('  4. Check if using correct connection string format');
      console.error('');
      console.error('🎯 QUICK FIX: Go to MongoDB Atlas → Security → Network Access → Add IP Address');
    } else if (error.name === 'MongoServerError') {
      console.error('💡 MongoDB Server Error - Check:');
      console.error('  1. Database credentials are correct');
      console.error('  2. Database user has proper permissions');
      console.error('  3. Database name exists');
    } else if (error.name === 'MongoParseError') {
      console.error('💡 Parse Error - Check:');
      console.error('  1. MongoDB URI format is correct');
      console.error('  2. Special characters in password are URL encoded');
    }
    
    // Don't exit in development, retry connection
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectToMongoDB, 5000);
  }
}

// Connect to MongoDB
connectToMongoDB();

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 Mongoose reconnected to MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, closing MongoDB connection...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

// Initialize Razorpay
console.log('Environment variables:');
console.log('RAZORPAY_KEY_ID:', RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', RAZORPAY_KEY_SECRET ? 'Set' : 'Missing');
console.log('MONGODB_URI:', MONGODB_URI);

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Health check endpoint with improved MongoDB status
app.get('/health', (req, res) => {
  const mongodbStatus = mongoose.connection.readyState;
  const mongodbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const healthData = {
    status: mongodbStatus === 1 ? 'OK' : 'WARNING',
    message: 'Handloom Backend API is running',
    mongodb: {
      status: mongodbStates[mongodbStatus],
      connected: mongodbStatus === 1,
      host: mongoose.connection.host || 'Not connected',
      port: mongoose.connection.port || 'N/A',
      name: mongoose.connection.name || 'Not connected',
      readyState: mongodbStatus
    },
    razorpay: {
      configured: !!(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET),
      keyId: RAZORPAY_KEY_ID ? 'Set' : 'Missing'
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };

  const statusCode = mongodbStatus === 1 ? 200 : 503;
  res.status(statusCode).json(healthData);
});

// Test MongoDB connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected',
        readyState: mongoose.connection.readyState
      });
    }

    // Test with a simple query
    const productCount = await Product.countDocuments();
    
    res.json({
      success: true,
      message: 'Database connection working',
      productCount,
      connection: {
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name,
        readyState: mongoose.connection.readyState
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Database query failed',
      details: error.message
    });
  }
});

// ... Rest of your API endpoints remain the same ...

// Create Razorpay order
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create order',
      details: error.message 
    });
  }
});

// Verify Razorpay payment
app.post('/api/razorpay/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing payment verification data' 
      });
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
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Payment verification failed',
      details: error.message 
    });
  }
});

// Get Razorpay key
app.get('/api/razorpay/key', (req, res) => {
  res.json({
    key: RAZORPAY_KEY_ID
  });
});

// Product endpoints (keeping your existing ones)
app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body;
    
    if (!productData.title || !productData.description || !productData.category || !productData.productCollection) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, description, category, productCollection'
      });
    }

    if (!productData.price || productData.price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Price must be greater than 0'
      });
    }

    const product = new Product(productData);
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate field error',
        details: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      details: error.message
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
      collection,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (collection) filter.collection = collection;
    if (status) filter.status = status;
    if (search) {
      filter.$text = { $search: search };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      details: error.message
    });
  }
});

// Get single product by ID
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
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      details: error.message
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
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      details: error.message
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
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      details: error.message
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
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'API endpoint not found' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Handloom Backend API running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 DB Test: http://localhost:${PORT}/api/test-db`);
  console.log(`💳 Razorpay Key: ${RAZORPAY_KEY_ID ? 'Configured' : 'Missing'}`);
});
