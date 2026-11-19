import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import listingRoutes from './routes/listing.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import reviewRoutes from './routes/review.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import hostingRoutes from './routes/hosting.routes.js';
import uploadRoutes from './routes/upload.routes.js';

import { errorHandler, notFound } from './middleware/error.middleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security & Parsing Middlewares
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const frontendDir = path.join(__dirname, '../FRONTEND/stitch_airbnb_frontend_clone');

// Clean User-Facing Web Page Routes
// Root route: Always shows the Login / Sign up page first
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(frontendDir, 'roamly_log_in_or_sign_up/code.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(frontendDir, 'roamly_log_in_or_sign_up/code.html'));
});
// Explore / Home listings page (opens after login or skip)
app.get('/explore', (req, res) => {
  res.sendFile(path.join(frontendDir, 'roamly_vacation_rentals_with_interactive_filters/code.html'));
});
app.get('/detail', (req, res) => {
  res.sendFile(path.join(frontendDir, 'roamly_villa_bellissima_listing_detail/code.html'));
});
app.get('/book', (req, res) => {
  res.sendFile(path.join(frontendDir, 'roamly_confirm_and_pay/code.html'));
});
app.get('/host', (req, res) => {
  res.sendFile(path.join(frontendDir, 'roamly_host_your_home_earn/code.html'));
});
app.get('/wishlists', (req, res) => {
  res.sendFile(path.join(frontendDir, 'roamly_wishlists_and_saved_collections/code.html'));
});
app.get('/profile', (req, res) => {
  res.sendFile(path.join(frontendDir, 'roamly_user_profile_account_settings/code.html'));
});

// Serve frontend static assets (CSS, JS, images, etc.)
app.use(express.static(frontendDir));

// Root & Health check
app.get('/api', (req, res) => {
  res.json({
    name: 'Airbnb / Roamly Clone API',
    status: 'online',
    version: '1.0.0',
    documentation: {
      auth: '/api/auth',
      users: '/api/users',
      listings: '/api/listings',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
      wishlists: '/api/wishlists',
      hosting: '/api/hosting',
      uploads: '/api/uploads'
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/hosting', hostingRoutes);
app.use('/api/uploads', uploadRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 Base API URL: http://localhost:${PORT}/api\n`);
});

export default app;

