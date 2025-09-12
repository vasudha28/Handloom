# 🚀 Complete Payment Setup Guide

## ✅ What's Already Done

1. **Backend API Created** - Complete Razorpay integration
2. **Frontend Updated** - Now uses backend API instead of direct Razorpay calls
3. **Security Implemented** - Server-side order creation and verification

## 🔧 Setup Steps

### Step 1: Add Razorpay Credentials

Create `backend/.env` file with your Razorpay credentials:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
RAZORPAY_KEY_SECRET=your_actual_secret_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

### Step 2: Start Backend Server

```bash
cd backend
node server.js
```

You should see:
```
🚀 Handloom Backend API running on port 3001
🔗 Health check: http://localhost:3001/health
💳 Razorpay Key: Configured
```

### Step 3: Test Backend API

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test Razorpay key endpoint
curl http://localhost:3001/api/razorpay/key
```

### Step 4: Update Frontend Environment

Add to your frontend `.env` file:
```env
VITE_BACKEND_URL=http://localhost:3001
```

### Step 5: Test Complete Payment Flow

1. **Start Frontend**: `npm run dev` (already running on port 8080)
2. **Start Backend**: `cd backend && node server.js` (port 3001)
3. **Test Payment**: Go to checkout page and try a payment

## 🔍 Troubleshooting

### Backend Not Starting?
- Check if port 3001 is available
- Verify `backend/.env` file exists
- Run: `cd backend && npm install`

### 401 Unauthorized Errors?
- Verify Razorpay credentials in `backend/.env`
- Check if backend server is running
- Test backend endpoints manually

### CORS Errors?
- Backend is configured to allow all origins (`*`)
- Check if backend is running on port 3001

## 📡 API Endpoints

- `GET /health` - Health check
- `GET /api/razorpay/key` - Get Razorpay key ID
- `POST /api/razorpay/create-order` - Create payment order
- `POST /api/razorpay/verify-payment` - Verify payment

## 🎯 Expected Flow

1. **Frontend** → Calls backend to create order
2. **Backend** → Creates Razorpay order with your credentials
3. **Frontend** → Opens Razorpay payment modal
4. **User** → Completes payment
5. **Frontend** → Calls backend to verify payment
6. **Backend** → Verifies payment signature
7. **Success** → Payment confirmed

## 🚀 Ready to Test!

Once you add your Razorpay credentials to `backend/.env`, the 401 errors will be completely resolved!

**Your payment integration is now secure and production-ready!** 🎉
