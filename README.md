# 🏡 Roamly — Full Stack Airbnb Clone

A modern, full-stack **Airbnb clone** engineered with a responsive **Tailwind CSS** frontend and a robust **Node.js, Express & MongoDB** backend API.

Featuring real-time destination search, category filtering (Amazing pools, Beachfront, Cabins, Mansions, etc.), complete authentication flows, stay detail views, multi-step booking checkout with price calculations, wishlists, and host earnings estimators.

---

## 🌟 Key Features

### 🖥️ Frontend
- **Explore & Filtering**:
  - Interactive destination search (e.g., search "Goa", "Italy", "Malibu", "Aspen").
  - Category carousel with dynamic icons and active indicators (*Amazing pools, Beachfront, Cabins, Mansions, Tropical, Lakefront, OMG!, Countryside, Ski-in/out, Islands, Tiny homes*).
  - Taxes toggle to dynamically calculate and display total estimated trip price.
  - Responsive design with smooth animations and hover effects.
- **Listing Details**:
  - High-resolution 5-photo mosaic image gallery.
  - Property overview, host badges, verified amenities list, and guest review highlights.
  - Interactive reservation widget linking directly into checkout.
- **Booking & Checkout**:
  - Dynamic stay calculation (nights × base price + cleaning fee + service fee + taxes).
  - Split pay options (*Pay in full* vs. *Pay part now, part later*).
  - Toast notifications and state validation.
- **Authentication**:
  - Phone and email login simulation with instant redirect.
  - Social login simulation (Google, Apple, Facebook).
  - Persistent login session via `localStorage` and JWT token.
- **Wishlists & User Profile**:
  - Saved collections, guest favorites, and custom wishlist creation.
  - Profile view with editable biography and host verification badges.
- **Host Your Home**:
  - Interactive nights slider and bedroom selector estimating monthly host earnings based on regional demand.

---

### ⚙️ Backend REST API
- **Modular MVC Architecture**: Clean separation of models, controllers, routes, and middleware.
- **Authentication & Security**:
  - JWT Authentication (Bearer Tokens + HTTP-only cookies).
  - Password hashing with `bcryptjs`.
  - Protected routes and role-based permissions (`user`, `host`, `admin`).
  - Security headers via `helmet` and flexible `cors`.
- **Search & Filtering Engine**:
  - Combined `$and` / `$or` query parser across title, city, state, country, category, and amenities.
  - Range filtering for min/max price and guest capacity.
- **Database Seeder**:
  - Pre-populated with 12 global stays (including private pool villas in Goa, Amalfi coast clifftop villa, alpine chalets, beachfront lofts) and 5 test users.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Tailwind CSS, JavaScript (ES6+), Google Material Symbols & Fonts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Utilities**: Morgan, Helmet, Cookie-Parser, Multer

---

## 📁 Project Directory Structure

```
CLONE/
├── README.md                          # Project documentation
├── .gitignore                         # Excluded files (node_modules, .env, etc.)
├── FRONTEND/
│   ├── index.html                     # Frontend entry redirect
│   ├── api.js                         # Reusable API connector client
│   └── stitch_airbnb_frontend_clone/
│       ├── roamly_log_in_or_sign_up/  # Login / Signup page
│       ├── roamly_vacation_rentals_with_interactive_filters/ # Main explore stays & filters
│       ├── roamly_villa_bellissima_listing_detail/           # Stay detail page
│       ├── roamly_confirm_and_pay/    # Booking checkout & payment
│       ├── roamly_wishlists_and_saved_collections/           # Saved wishlists
│       ├── roamly_user_profile_account_settings/             # Profile & account settings
│       └── roamly_host_your_home_earn/                       # Host earnings calculator
└── BACKEND/
    ├── server.js                      # Express app & static file serving
    ├── package.json                   # Dependencies & scripts
    ├── .env.example                   # Environment configuration template
    ├── config/
    │   └── db.js                      # MongoDB connection handler
    ├── controllers/                   # Route handlers (auth, listings, bookings, etc.)
    ├── models/                        # Mongoose schemas (User, Listing, Booking, etc.)
    ├── routes/                        # API route declarations
    ├── middleware/                    # Auth, validation, and error middlewares
    ├── seeds/
    │   └── seed.js                    # Database seeder with sample data
    └── utils/                         # Token generator & API query features
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** running locally on default port `27017` (or a MongoDB Atlas connection URI)

### 2. Clone the Repository
```bash
git clone https://github.com/HarshSahu22/clone.git
cd clone
```

### 3. Setup the Backend
Navigate to the `BACKEND` directory and install dependencies:
```bash
cd BACKEND
npm install
```

Configure your environment variables by copying `.env.example`:
```bash
cp .env.example .env
```
*(Default settings connect to `mongodb://localhost:27017/airbnb_clone` and run on port `5000`)*.

### 4. Seed the Database
Populate MongoDB with verified listings, hosts, and test accounts:
```bash
node seeds/seed.js
```

### 5. Start the Server
```bash
node server.js
```
The server will start listening at:
👉 **`http://localhost:5000`**

---

## 🌐 Available Routes & Localhost Links

When the backend server is running, the following endpoints are served directly:

| Page | URL | Description |
|---|---|---|
| **Login / Sign Up** | [http://localhost:5000](http://localhost:5000) or `/login` | Initial entry page with phone/email/social login |
| **Explore Stays** | [http://localhost:5000/explore](http://localhost:5000/explore) | Main vacation rental gallery with live filters & search |
| **Listing Detail** | [http://localhost:5000/detail](http://localhost:5000/detail) | 5-photo gallery, amenities, reviews & reserve widget |
| **Confirm & Pay** | [http://localhost:5000/book](http://localhost:5000/book) | Multi-step booking checkout & price summary |
| **Wishlists** | [http://localhost:5000/wishlists](http://localhost:5000/wishlists) | Curated wishlists & saved stays |
| **User Profile** | [http://localhost:5000/profile](http://localhost:5000/profile) | Traveler account settings & biography |
| **Host Setup** | [http://localhost:5000/host](http://localhost:5000/host) | Host home earnings estimator |
| **API Health** | [http://localhost:5000/api](http://localhost:5000/api) | API status & endpoint directory |

---

## 🔑 Test Accounts

All accounts use the default password: **`password123`**

- **Host (Amalfi Coast)**: `marco@example.com`
- **Host (Malibu)**: `alice@example.com`
- **Host (San Francisco)**: `david@example.com`
- **Traveler / Guest**: `sarah@example.com`
- **Administrator**: `admin@example.com`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
