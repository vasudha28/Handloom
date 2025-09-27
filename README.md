# 🧵 Handloom Merchandise Portal Platform

A modern, full-stack e-commerce platform built for handloom products with integrated payment processing, admin dashboard, and responsive design.

https://handloom1.vercel.app/

## 🌟 Features

### Frontend (React + TypeScript)
- 🎨 **Modern UI/UX** - Built with React, TypeScript, and Tailwind CSS
- 🛍️ **Product Catalog** - Browse and filter handloom products
- 🛒 **Shopping Cart** - Add to cart, wishlist functionality
- 💳 **Payment Integration** - Secure Razorpay payment processing
- 👤 **User Authentication** - Firebase authentication system
- 📱 **Responsive Design** - Mobile-first approach
- 🎯 **Admin Dashboard** - Product management and analytics

### Backend (Node.js + Express)
- 🚀 **RESTful API** - Express.js with MongoDB
- 💰 **Payment Processing** - Razorpay integration
- 🔐 **CORS Security** - Enhanced CORS configuration
- 📊 **Product Management** - CRUD operations for products
- 🗄️ **Database** - MongoDB with Mongoose ODM
- ☁️ **Cloud Ready** - Vercel deployment optimized

## 🏗️ Project Structure

```
handloom/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   │   ├── admin/               # Admin dashboard components
│   │   ├── auth/                # Authentication components
│   │   ├── checkout/            # Checkout flow components
│   │   └── ui/                  # Base UI components (shadcn/ui)
│   ├── pages/                   # Page components
│   │   ├── admin/               # Admin pages
│   │   ├── Auth.tsx            # Authentication page
│   │   ├── Cart.tsx            # Shopping cart
│   │   ├── Checkout.tsx        # Checkout process
│   │   └── Products.tsx        # Product listing
│   ├── services/               # API service layers
│   │   ├── paymentService.ts   # Razorpay integration
│   │   └── productService.ts   # Product API calls
│   ├── contexts/               # React contexts
│   │   ├── CartContext.tsx     # Shopping cart state
│   │   └── WishlistContext.tsx # Wishlist state
│   └── config/                 # Configuration files
│       └── razorpay.ts         # Razorpay configuration
├── backend/                     # Backend API
│   ├── api/                    # Vercel serverless functions
│   │   └── index.js            # Main API handler
│   ├── models/                 # Database models
│   │   └── Product.js          # Product schema
│   ├── server.js               # Local development server
│   ├── package.json            # Backend dependencies
│   └── vercel.json             # Backend Vercel config
├── public/                     # Static assets
├── dist/                       # Built frontend files
├── vercel.json                 # Frontend Vercel config
└── package.json                # Frontend dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Razorpay account
- Vercel account (for deployment)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd handloom
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Environment Setup

#### Frontend Environment
Create `.env` in the root directory:
```env
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Backend Environment
Create `.env` in the `backend` directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/handloom_portal
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NODE_ENV=development
```

### 4. Database Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in backend `.env`

### 5. Razorpay Setup

1. Create a Razorpay account
2. Get your API keys from the dashboard
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in backend `.env`

### 6. Firebase Setup

1. Create a Firebase project
2. Enable Authentication
3. Get your Firebase config
4. Update frontend `.env` with Firebase credentials

## 🛠️ Development

### Start Frontend Development Server
```bash
npm run dev
```
Frontend will be available at `http://localhost:5173`

### Start Backend Development Server
```bash
cd backend
npm run dev
```
Backend API will be available at `http://localhost:3001`

### Build for Production
```bash
# Frontend
npm run build

# Backend (if deploying separately)
cd backend
npm start
```

## 🚀 Deployment

### Option 1: Full Stack Deployment (Recommended)
Deploy both frontend and backend together:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy from root directory
4. Vercel will automatically handle routing

### Option 2: Separate Deployments
Deploy frontend and backend separately:

#### Frontend Deployment
1. Deploy from root directory
2. Set `VITE_API_URL` to your backend URL

#### Backend Deployment
1. Deploy from `backend` directory
2. Set backend environment variables

### Environment Variables for Production

#### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.vercel.app
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Backend (Vercel)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/handloom_portal
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NODE_ENV=production
```

## 📚 API Documentation

### Base URL
- Development: `http://localhost:3001`
- Production: `https://your-domain.vercel.app`

### Endpoints

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories` - Get categories

#### Payment
- `POST /api/razorpay/create-order` - Create payment order
- `POST /api/razorpay/verify-payment` - Verify payment
- `GET /api/razorpay/key` - Get Razorpay key

#### Health Check
- `GET /health` - API health status

### Query Parameters

#### Products Endpoint
```
GET /api/products?page=1&limit=10&category=sarees&search=handloom&sortBy=price&sortOrder=asc
```

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category
- `search` - Search in name and description
- `sortBy` - Sort field (price, createdAt, etc.)
- `sortOrder` - Sort direction (asc, desc)

## 🛡️ Security Features

- **CORS Protection** - Configurable origin restrictions
- **Input Validation** - Request validation and sanitization
- **Environment Variables** - Secure credential management
- **HTTPS Only** - Production deployments use HTTPS
- **Payment Security** - Razorpay's secure payment processing

## 🎨 UI Components

Built with **shadcn/ui** components:
- Buttons, Forms, Modals
- Navigation, Cards, Tables
- Responsive Grid System
- Dark/Light Theme Support

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Accessible design patterns

## 🔧 Technologies Used

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Query** - Data fetching
- **Firebase** - Authentication
- **Razorpay** - Payment processing

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Razorpay** - Payment gateway
- **CORS** - Cross-origin requests

### Deployment
- **Vercel** - Hosting platform
- **MongoDB Atlas** - Cloud database
- **Environment Variables** - Configuration

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration in backend
   - Verify allowed origins in production

2. **Database Connection**
   - Verify MongoDB URI
   - Check network connectivity
   - Ensure database user permissions

3. **Payment Issues**
   - Verify Razorpay credentials
   - Check webhook configurations
   - Test with Razorpay test mode

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify environment variables

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in backend environment.

