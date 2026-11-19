import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 4000
    },
    propertyType: {
      type: String,
      required: true,
      enum: [
        'villa',
        'cabin',
        'apartment',
        'house',
        'mansion',
        'treehouse',
        'dome',
        'cottage',
        'bungalow',
        'loft',
        'hotel',
        'tiny_home',
        'other'
      ]
    },
    roomType: {
      type: String,
      required: true,
      enum: ['entire_place', 'private_room', 'shared_room'],
      default: 'entire_place'
    },
    category: {
      type: String,
      required: true,
      enum: [
        'beachfront',
        'cabins',
        'pools',
        'mansions',
        'tropical',
        'lakefront',
        'omg',
        'countryside',
        'ski_in_out',
        'islands',
        'tiny_homes',
        'trending',
        'icons',
        'design'
      ],
      default: 'beachfront'
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      country: { type: String, required: true },
      zipCode: { type: String, default: '' },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0]
        }
      }
    },
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false }
      }
    ],
    price: {
      basePrice: { type: Number, required: [true, 'Base price per night is required'], min: 0 },
      cleaningFee: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
      weeklyDiscount: { type: Number, default: 0, min: 0, max: 100 },
      monthlyDiscount: { type: Number, default: 0, min: 0, max: 100 }
    },
    capacity: {
      guests: { type: Number, required: true, min: 1 },
      bedrooms: { type: Number, required: true, min: 0 },
      beds: { type: Number, required: true, min: 1 },
      bathrooms: { type: Number, required: true, min: 0 }
    },
    bedroomDetails: [
      {
        roomNumber: Number,
        bedType: String,
        count: Number
      }
    ],
    amenities: [
      {
        type: String,
        trim: true
      }
    ],
    houseRules: {
      checkIn: { type: String, default: '15:00' },
      checkOut: { type: String, default: '11:00' },
      smokingAllowed: { type: Boolean, default: false },
      petsAllowed: { type: Boolean, default: false },
      partiesAllowed: { type: Boolean, default: false },
      additionalRules: [String]
    },
    guestFavorite: {
      type: Boolean,
      default: false
    },
    cancellationPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict', 'super_strict'],
      default: 'flexible'
    },
    availability: {
      minNights: { type: Number, default: 1 },
      maxNights: { type: Number, default: 365 },
      blockedDates: [Date],
      instantBook: { type: Boolean, default: true }
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
      cleanliness: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
      checkIn: { type: Number, default: 0 },
      value: { type: Number, default: 0 }
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending', 'archived'],
      default: 'active'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

listingSchema.index({ 'location.coordinates': '2dsphere' });
listingSchema.index({ 'location.city': 1, 'location.country': 1 });
listingSchema.index({ category: 1 });
listingSchema.index({ 'price.basePrice': 1 });
listingSchema.index({ 'rating.average': -1 });
listingSchema.index({
  title: 'text',
  description: 'text',
  'location.city': 'text',
  'location.country': 'text'
});

listingSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'listing'
});

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;

