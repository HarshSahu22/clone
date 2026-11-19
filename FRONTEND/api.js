/**
 * Roamly / Airbnb Clone — Frontend API Client
 * Connects frontend HTML pages to the Express/MongoDB backend at http://localhost:5000/api
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Helper to retrieve token from localStorage
export const getToken = () => localStorage.getItem('roamly_token');
export const setToken = (token) => localStorage.setItem('roamly_token', token);
export const removeToken = () => localStorage.removeItem('roamly_token');

// Generic request wrapper with auto-attached Bearer token
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

// ---------------- AUTH API ----------------
export const authApi = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  phoneLogin: (phone, countryCode) => request('/auth/phone-login', { method: 'POST', body: JSON.stringify({ phone, countryCode }) }),
  socialLogin: (provider, email, name) => request('/auth/social', { method: 'POST', body: JSON.stringify({ provider, email, name }) }),
  getMe: () => request('/auth/me'),
  logout: () => {
    removeToken();
    return request('/auth/logout', { method: 'POST' });
  }
};

// ---------------- USER API ----------------
export const userApi = {
  getProfile: (id) => request(`/users/${id}`),
  updateProfile: (profileData) => request('/users/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  updateBio: (bio) => request('/users/bio', { method: 'PUT', body: JSON.stringify({ bio }) }),
  becomeHost: () => request('/users/become-host', { method: 'PUT' }),
  getActivity: () => request('/users/account/activity')
};

// ---------------- LISTINGS API ----------------
export const listingApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/listings${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/listings/${id}`),
  getCategories: () => request('/listings/categories'),
  getMyListings: () => request('/listings/my/listings'),
  create: (listingData) => request('/listings', { method: 'POST', body: JSON.stringify(listingData) })
};

// ---------------- BOOKINGS API ----------------
export const bookingApi = {
  create: (bookingData) => request('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  getMyTrips: () => request('/bookings/my-trips'),
  getHostReservations: () => request('/bookings/host-reservations'),
  getById: (id) => request(`/bookings/${id}`),
  cancel: (id, reason) => request(`/bookings/${id}/cancel`, { method: 'PUT', body: JSON.stringify({ reason }) })
};

// ---------------- REVIEWS API ----------------
export const reviewApi = {
  getByListing: (listingId, page = 1) => request(`/reviews/listing/${listingId}?page=${page}`),
  create: (reviewData) => request('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),
  respond: (reviewId, comment) => request(`/reviews/${reviewId}/respond`, { method: 'PUT', body: JSON.stringify({ comment }) })
};

// ---------------- WISHLISTS API ----------------
export const wishlistApi = {
  getAll: (filter = 'all', sort = 'recent') => request(`/wishlists?filter=${filter}&sort=${sort}`),
  getById: (id) => request(`/wishlists/${id}`),
  create: (name, description, privacy) => request('/wishlists', { method: 'POST', body: JSON.stringify({ name, description, privacy }) }),
  addListing: (wishlistId, listingId) => request(`/wishlists/${wishlistId}/listings/${listingId}`, { method: 'POST' }),
  removeListing: (wishlistId, listingId) => request(`/wishlists/${wishlistId}/listings/${listingId}`, { method: 'DELETE' }),
  toggleArchive: (wishlistId) => request(`/wishlists/${wishlistId}/archive`, { method: 'PUT' })
};

// ---------------- HOSTING CALCULATOR API ----------------
export const hostingApi = {
  getEarningsEstimate: (location, propertyType, bedrooms, nights) => {
    const params = new URLSearchParams({ location, propertyType, bedrooms, nights }).toString();
    return request(`/hosting/earnings-estimate?${params}`);
  }
};

