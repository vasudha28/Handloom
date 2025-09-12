# Backend Deployment Guide

## 🚀 Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your repository** (if not already imported)
4. **Select the `backend` folder** as the root directory
5. **Set the following environment variables:**
   ```
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   NODE_ENV=production
   PORT=3001
   ```
6. **Click "Deploy"**

### Method 2: Vercel CLI (Alternative)

If you want to use CLI, first fix PowerShell execution policy:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run:
```bash
vercel login
vercel --prod
```

## 🔧 Environment Variables

Make sure to set these in your Vercel project settings:

- `RAZORPAY_KEY_ID` - Your Razorpay Key ID
- `RAZORPAY_KEY_SECRET` - Your Razorpay Key Secret
- `NODE_ENV` - Set to `production`
- `PORT` - Set to `3001` (optional, Vercel handles this)

## 🧪 Testing After Deployment

1. **Health Check:** `https://your-backend-url.vercel.app/health`
2. **Razorpay Key:** `https://your-backend-url.vercel.app/api/razorpay/key`
3. **Create Order:** `https://your-backend-url.vercel.app/api/razorpay/create-order`

## 📝 Important Notes

- The `vercel.json` file is already configured
- The backend will be available at `https://your-backend-url.vercel.app`
- Update your frontend's `VITE_BACKEND_URL` to point to this URL
- Make sure CORS is properly configured for your frontend domain

## 🐛 Troubleshooting

If you get "API not found" errors:

1. Check that the deployment was successful
2. Verify environment variables are set
3. Check the function logs in Vercel dashboard
4. Ensure the `vercel.json` file is in the backend root directory
