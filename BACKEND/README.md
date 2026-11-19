# 🏡 Roamly (Airbnb Clone) — Backend REST API

Production-ready backend REST API built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**, specifically architected to power every page and feature of the Roamly Airbnb frontend clone.

---

## 🏗️ Architecture & Features

- **Authentication & Security:**
  - JWT Authentication (Bearer Header + HTTP-only Cookies)
  - Password hashing with `bcryptjs` (salt rounds: 12)
  - Role-based authorization (`user`, `host`, `admin`)
  - Phone-based login simulation (matching the frontend modal)
  - Social login endpoint (Google, Apple, Facebook)
  - Helmet for HTTP security headers, CORS enabled, and sanitized inputs

- **Listings & Search Engine:**
  - Full-text search across titles, descriptions, cities, and countries
  - Category filtering (`beachfront`, `cabins`, `pools`, `mansions`, `omg`, etc.)
  - Property type & Room type filtering (`entire_place`, `private_room`, `shared_room`)
  - Price range slider filtering (`minPrice`, `maxPrice`)
  - Capacity counters (guests, bedrooms, beds, bathrooms)
  - Multi-amenity filtering (`wifi,pool,kitchen,hot_tub,workspace`)
  - Geospatial indexing (`2dsphere`) for coordinate-based map lookups
  - Pagination, sorting, and field limiting

- **Bookings & Payments:**
  - Nightly rate calculation with dynamic taxes (10%), cleaning fee, and service fee (12%)
  - Long-term stay discounts (weekly and monthly)
  - Date conflict detection preventing double-bookings
  - Flexible payment schedules: **Pay in full** or **Split payment (Pay in two)**
  - Support for multiple payment methods: Credit Card, PayPal, Apple Pay, Google Pay
  - Trip management for travelers & reservation management for hosts

- **Reviews & Ratings:**
  - 6-dimension ratings: Overall, Cleanliness, Accuracy, Communication, Location, Check-in, and Value
  - Automated average rating recalculation for listings
  - Host reply functionality to guest reviews

- **Wishlists & Collections:**
  - Create, manage, and delete custom collections
  - Add/remove listings from wishlists
  - Shared wishlists with collaborators
  - Archive/restore wishlists

- **Host Earnings Calculator:**
  - Matches the interactive slider and bedroom chips on the **Host Your Home** page

- **File Uploads:**
  - Image upload handler with `multer` supporting JPG, PNG, WEBP, and GIF

---

## 📁 Directory Structure

```
BACKEND/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   ├── auth.controller.js       # Auth & tokens
│   ├── user.controller.js       # User profiles & settings
│   ├── listing.controller.js    # Listings CRUD & filters
│   ├── booking.controller.js    # Reservations & checkout
│   ├── review.controller.js     # Reviews & ratings
│   ├── wishlist.controller.js   # Wishlists & collections
│   ├── hosting.controller.js    # Host earnings calculator
│   └── upload.controller.js     # Image uploads
├── middleware/
│   ├── auth.middleware.js       # Protect & authorize
│   ├── error.middleware.js      # Global error handling
│   └── validate.middleware.js   # Request validation
├── models/
│   ├── User.model.js            # User schema
│   ├── Listing.model.js         # Listing schema
│   ├── Booking.model.js         # Booking schema
│   ├── Review.model.js          # Review schema
│   └── Wishlist.model.js        # Wishlist schema
├── routes/
│   ├── auth.routes.js           # /api/auth
│   ├── user.routes.js           # /api/users
│   ├── listing.routes.js        # /api/listings
│   ├── booking.routes.js        # /api/bookings
│   ├── review.routes.js         # /api/reviews
│   ├── wishlist.routes.js       # /api/wishlists
│   ├── hosting.routes.js        # /api/hosting
│   └── upload.routes.js         # /api/uploads
├── seeds/
│   └── seed.js                  # Database seeder with sample data
├── utils/
│   ├── apiFeatures.js           # Filter, sort, paginate
│   └── generateToken.js         # JWT generator
├── uploads/                     # Uploaded files
├── .env                         # Environment variables
├── .env.example
├── package.json
└── server.js                    # Express app entry point
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** running locally (`mongodb://localhost:27017/airbnb_clone`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI

### 2. Install Dependencies
Open a terminal in the `BACKEND` directory:
```bash
cd BACKEND
npm install
```

### 3. Configure `.env`
Ensure your MongoDB connection string is set in `BACKEND/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/airbnb_clone
JWT_SECRET=super_secret_jwt_key_airbnb_clone_2026_xyz
CLIENT_URL=http://localhost:3000
```

### 4. Seed the Database
Populate demo users, listings (including Villa Bellissima), reviews, bookings, and wishlists:
```bash
npm run seed
```

### 5. Start the Server
```bash
# Development mode (with live reload)
npm run dev

# Or standard start
npm start
```

API is now live at: `http://localhost:5000/api`

---

## 🔑 Demo Test Accounts

| Role | Name | Email | Password |
|---|---|---|---|
| **Host (Positano)** | Marco Bellini | `marco@example.com` | `password123` |
| **Host (Malibu)** | Alice Johnson | `alice@example.com` | `password123` |
| **Host (SF)** | David Chen | `david@example.com` | `password123` |
| **Traveler / Guest** | Sarah Connor | `sarah@example.com` | `password123` |
| **Administrator** | Admin Roamly | `admin@example.com` | `password123` |

---

## 📡 API Reference

### 🔐 Auth (`/api/auth`)
- `POST /api/auth/register` — Create new account
- `POST /api/auth/login` — Sign in with email & password
- `POST /api/auth/phone-login` — Sign in / Register with phone number
- `POST /api/auth/social` — Sign in via Google / Apple / Facebook
- `GET  /api/auth/me` — Get current logged-in user (Auth required)
- `POST /api/auth/logout` — Clear auth cookie

### 👤 Users (`/api/users`)
- `GET  /api/users/:id` — Public profile of host or user
- `PUT  /api/users/profile` — Update personal information (Auth required)
- `PUT  /api/users/bio` — Inline update bio text (Auth required)
- `PUT  /api/users/password` — Change password (Auth required)
- `PUT  /api/users/become-host` — Upgrade account to host status (Auth required)
- `GET  /api/users/account/activity` — Account activity & login alerts (Auth required)
- `DELETE /api/users/account` — Delete account (Auth required)

### 🏡 Listings (`/api/listings`)
- `GET  /api/listings` — Search & filter listings:
  - Query options: `search`, `city`, `country`, `category`, `roomType`, `propertyType`, `minPrice`, `maxPrice`, `guests`, `bedrooms`, `beds`, `bathrooms`, `amenities`, `instantBook`, `guestFavorite`, `sort`, `page`, `limit`
- `GET  /api/listings/categories` — Get category list with live counts
- `GET  /api/listings/my/listings` — Get current host's properties (Auth required)
- `GET  /api/listings/:id` — Get single listing with host details and reviews
- `POST /api/listings` — Create new listing (Auth required)
- `PUT  /api/listings/:id` — Edit listing (Host only)
- `DELETE /api/listings/:id` — Delete listing (Host only)

### 📅 Bookings (`/api/bookings`)
- `POST /api/bookings` — Create reservation & confirm payment (Auth required)
- `GET  /api/bookings/my-trips` — Get user's guest trips (Auth required)
- `GET  /api/bookings/host-reservations` — Get reservations for host (Auth required)
- `GET  /api/bookings/:id` — View specific booking details (Auth required)
- `PUT  /api/bookings/:id/cancel` — Cancel booking with refund (Auth required)

### ⭐ Reviews (`/api/reviews`)
- `GET  /api/reviews/listing/:listingId` — Get reviews for a listing
- `POST /api/reviews` — Submit review for listing (Auth required)
- `PUT  /api/reviews/:id/respond` — Host response to guest review (Host only)
- `DELETE /api/reviews/:id` — Remove review (Author or Admin)

### ❤️ Wishlists (`/api/wishlists`)
- `GET  /api/wishlists` — Get user's wishlists (`filter=all|shared|archived`, `sort=recent|alpha|most_stays`)
- `GET  /api/wishlists/:id` — Get single wishlist with listings
- `POST /api/wishlists` — Create new wishlist (Auth required)
- `POST /api/wishlists/:id/listings/:listingId` — Save listing to wishlist
- `DELETE /api/wishlists/:id/listings/:listingId` — Remove listing from wishlist
- `PUT  /api/wishlists/:id/archive` — Toggle archive state
- `DELETE /api/wishlists/:id` — Delete wishlist

### 💰 Hosting Tools (`/api/hosting`)
- `GET  /api/hosting/earnings-estimate?location=Positano&bedrooms=2&nights=7` — Dynamic host earnings calculator

### 📷 Uploads (`/api/uploads`)
- `POST /api/uploads/image` — Upload single photo
- `POST /api/uploads/images` — Upload multiple listing photos (up to 10)

