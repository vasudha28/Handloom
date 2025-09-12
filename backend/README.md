# Handloom Portal Backend API

This is the backend API for the Handloom Portal, handling Razorpay payment integration securely.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
Copy the example environment file and update with your credentials:
```bash
# Copy the example file
cp env.example .env

# Edit the .env file with your actual Razorpay credentials
# The .env file is already in .gitignore for security
```

**Required Environment Variables:**
```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 3. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Health Check
- **GET** `/health` - Check if the API is running

### Razorpay Integration
- **POST** `/api/razorpay/create-order` - Create a new payment order
- **POST** `/api/razorpay/verify-payment` - Verify payment signature
- **GET** `/api/razorpay/key` - Get Razorpay key ID

## 🔧 Configuration

### Environment Variables
- `RAZORPAY_KEY_ID` - Your Razorpay Key ID (starts with rzp_test_ or rzp_live_)
- `RAZORPAY_KEY_SECRET` - Your Razorpay Key Secret
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

### CORS Configuration
The API is configured to accept requests from:
- `http://localhost:8080` (Vite dev server)
- `http://localhost:3000` (Alternative dev server)
- Your Vercel domain

## 🔒 Security Features

- **Server-side order creation** - Orders are created securely on the backend
- **Payment verification** - All payments are verified using Razorpay's signature verification
- **CORS protection** - Only allowed origins can access the API
- **Environment variables** - Sensitive data is stored securely

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy the backend API
4. Update frontend `VITE_BACKEND_URL` to point to your deployed API

### Other Platforms
- **Heroku**: Add environment variables and deploy
- **Railway**: Connect GitHub and deploy
- **DigitalOcean**: Use App Platform

## 📝 API Usage Examples

### Create Order
```javascript
const response = await fetch('http://localhost:3001/api/razorpay/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 1000, // ₹10.00
    currency: 'INR',
    receipt: 'order_123'
  })
});
```

### Verify Payment
```javascript
const response = await fetch('http://localhost:3001/api/razorpay/verify-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    razorpay_payment_id: 'pay_123',
    razorpay_order_id: 'order_123',
    razorpay_signature: 'signature_123'
  })
});
```

## 🛠️ Development

### Project Structure
```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies
├── .env.example       # Environment variables template
└── README.md          # This file
```

### Dependencies
- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **razorpay** - Razorpay SDK
- **crypto** - Node.js crypto module
- **dotenv** - Environment variables

## 🔍 Troubleshooting

### Common Issues
1. **401 Unauthorized** - Check your Razorpay credentials
2. **CORS errors** - Verify allowed origins in server.js
3. **Port conflicts** - Change PORT in .env file

### Debug Mode
Set `NODE_ENV=development` for detailed error logs.

## 📞 Support

For issues related to:
- **Razorpay integration** - Check Razorpay documentation
- **API errors** - Check server logs
- **CORS issues** - Verify frontend URL in CORS configuration
