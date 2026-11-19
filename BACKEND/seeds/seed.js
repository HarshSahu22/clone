import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from '../models/User.model.js';
import Listing from '../models/Listing.model.js';
import Booking from '../models/Booking.model.js';
import Review from '../models/Review.model.js';
import Wishlist from '../models/Wishlist.model.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/airbnb_clone';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Wishlist.deleteMany({});
    console.log('🗑️  Cleared existing collections');

    const hashedPassword = await bcrypt.hash('password123', 12);

    // 1. Create Users
    const users = await User.create([
      {
        firstName: 'Marco',
        lastName: 'Bellini',
        email: 'marco@example.com',
        password: hashedPassword,
        phone: '+39-089-875-112',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        bio: 'Born and raised in Positano. Architect and hospitality enthusiast for over 12 years.',
        work: 'Architect & Villa Restorer',
        location: 'Positano, Italy',
        languages: ['Italian', 'English', 'French'],
        isHost: true,
        isSuperhost: true,
        isVerified: true,
        verification: { email: true, phone: true, identity: true },
        role: 'host'
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        password: hashedPassword,
        phone: '+1-310-555-0199',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        bio: 'Passionate host and ocean lover. Welcome to sunny California!',
        work: 'Interior Designer',
        location: 'Malibu, CA, USA',
        languages: ['English', 'Spanish'],
        isHost: true,
        isSuperhost: true,
        isVerified: true,
        verification: { email: true, phone: true, identity: true },
        role: 'host'
      },
      {
        firstName: 'David',
        lastName: 'Chen',
        email: 'david@example.com',
        password: hashedPassword,
        phone: '+1-415-555-0142',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        bio: 'Tech entrepreneur and minimalist design lover living in San Francisco.',
        work: 'Software Architect',
        location: 'San Francisco, CA, USA',
        languages: ['English', 'Mandarin'],
        isHost: true,
        isSuperhost: true,
        isVerified: true,
        verification: { email: true, phone: true, identity: true },
        role: 'host'
      },
      {
        firstName: 'Sarah',
        lastName: 'Connor',
        email: 'sarah@example.com',
        password: hashedPassword,
        phone: '+1-212-555-0188',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        bio: 'Travel journalist and photographer. Always searching for breathtaking views and cozy spaces.',
        work: 'Travel Journalist',
        location: 'New York, NY, USA',
        languages: ['English', 'Italian'],
        isHost: false,
        isVerified: true,
        verification: { email: true, phone: true, identity: true },
        role: 'user'
      },
      {
        firstName: 'Admin',
        lastName: 'Roamly',
        email: 'admin@example.com',
        password: hashedPassword,
        phone: '+1-800-555-0100',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
        role: 'admin',
        isVerified: true
      }
    ]);

    console.log(`👤 Created ${users.length} users`);

    // 2. Create Listings (including Villa Bellissima from frontend)
    const listings = await Listing.create([
      {
        host: users[0]._id, // Marco Bellini
        title: 'Villa Bellissima — Cliffside Amalfi Coast Sanctuary',
        description:
          'Perched gracefully on the dramatic cliffs of Positano, Villa Bellissima offers panoramic Mediterranean vistas, an infinity edge saltwater pool, private lemon grove terraces, and bespoke Italian craftsmanship. Designed by celebrated architect Marco Bellini, every corner combines historical charm with contemporary barefoot luxury.',
        propertyType: 'villa',
        roomType: 'entire_place',
        category: 'beachfront',
        location: {
          address: 'Via Cristoforo Colombo 45',
          city: 'Positano',
          state: 'Salerno',
          country: 'Italy',
          zipCode: '84017',
          coordinates: { type: 'Point', coordinates: [14.4849, 40.6281] }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200',
            caption: 'Panoramic cliffside view over Positano bay',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
            caption: 'Infinity pool overlooking Mediterranean sunset'
          },
          {
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
            caption: 'Master bedroom with open terrace'
          },
          {
            url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
            caption: 'Open concept living area'
          },
          {
            url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
            caption: 'Chef kitchen with authentic marble surfaces'
          }
        ],
        price: {
          basePrice: 420,
          cleaningFee: 150,
          serviceFee: 200,
          taxes: 180,
          currency: 'USD',
          weeklyDiscount: 10,
          monthlyDiscount: 20
        },
        capacity: {
          guests: 6,
          bedrooms: 3,
          beds: 4,
          bathrooms: 3
        },
        bedroomDetails: [
          { roomNumber: 1, bedType: 'King Bed', count: 1 },
          { roomNumber: 2, bedType: 'Queen Bed', count: 1 },
          { roomNumber: 3, bedType: 'Single Bed', count: 2 }
        ],
        amenities: [
          'wifi',
          'pool',
          'kitchen',
          'air_conditioning',
          'free_parking',
          'beach_access',
          'hot_tub',
          'workspace',
          'washer',
          'dryer',
          'bbq_grill',
          'outdoor_dining'
        ],
        guestFavorite: true,
        cancellationPolicy: 'flexible',
        rating: {
          average: 4.96,
          count: 142,
          cleanliness: 5.0,
          accuracy: 4.9,
          communication: 5.0,
          location: 5.0,
          checkIn: 4.9,
          value: 4.9
        },
        status: 'active'
      },
      {
        host: users[1]._id, // Alice
        title: 'Modern Malibu Oceanfront Glass House',
        description:
          'Stunning architectural masterpiece positioned directly over the sands of Malibu. Wall-to-wall glass sliders open to an oceanfront deck where dolphin sightings are a daily occurrence.',
        propertyType: 'villa',
        roomType: 'entire_place',
        category: 'beachfront',
        location: {
          address: '21804 Pacific Coast Hwy',
          city: 'Malibu',
          state: 'California',
          country: 'United States',
          zipCode: '90265',
          coordinates: { type: 'Point', coordinates: [-118.6637, 34.037] }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
            caption: 'Oceanfront exterior',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
            caption: 'Main salon with ocean view'
          }
        ],
        price: {
          basePrice: 580,
          cleaningFee: 200,
          serviceFee: 240,
          taxes: 210,
          currency: 'USD'
        },
        capacity: {
          guests: 8,
          bedrooms: 4,
          beds: 5,
          bathrooms: 4
        },
        amenities: ['wifi', 'pool', 'kitchen', 'air_conditioning', 'beach_access', 'workspace'],
        guestFavorite: true,
        rating: { average: 4.98, count: 98, cleanliness: 5.0, accuracy: 5.0, communication: 5.0, location: 5.0, checkIn: 5.0, value: 4.9 },
        status: 'active'
      },
      {
        host: users[2]._id, // David Chen
        title: 'Architectural Timber Loft in Downtown SoMa',
        description:
          'Historic 1920s brick and timber warehouse converted into a high-spec designer loft. Featuring 16-foot ceilings, curated modern art, custom chef kitchen, and private roof garden.',
        propertyType: 'loft',
        roomType: 'entire_place',
        category: 'design',
        location: {
          address: '540 Howard St',
          city: 'San Francisco',
          state: 'California',
          country: 'United States',
          zipCode: '94105',
          coordinates: { type: 'Point', coordinates: [-122.3986, 37.7885] }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
            caption: 'Main loft space',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
            caption: 'Kitchen and dining island'
          }
        ],
        price: {
          basePrice: 220,
          cleaningFee: 90,
          serviceFee: 65,
          taxes: 70,
          currency: 'USD'
        },
        capacity: {
          guests: 2,
          bedrooms: 1,
          beds: 1,
          bathrooms: 1.5
        },
        amenities: ['wifi', 'kitchen', 'workspace', 'elevator', 'air_conditioning', 'washer', 'dryer'],
        guestFavorite: false,
        rating: { average: 4.88, count: 187, cleanliness: 4.9, accuracy: 4.9, communication: 4.9, location: 4.9, checkIn: 4.8, value: 4.8 },
        status: 'active'
      },
      {
        host: users[0]._id,
        title: 'Snowpine Luxury Chalet & Hot Tub',
        description:
          'Ski directly from your doorstep into Aspen Mountain terrain. Warm up by the double-sided granite fireplace, unwind in the sunken cedar hot tub, and gaze at snow-covered pines.',
        propertyType: 'cabin',
        roomType: 'entire_place',
        category: 'ski_in_out',
        location: {
          address: '320 Aspen Way',
          city: 'Aspen',
          state: 'Colorado',
          country: 'United States',
          zipCode: '81611',
          coordinates: { type: 'Point', coordinates: [-106.8175, 39.1911] }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
            caption: 'Chalet exterior in snow',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200',
            caption: 'Cozy living room'
          }
        ],
        price: {
          basePrice: 380,
          cleaningFee: 140,
          serviceFee: 110,
          taxes: 120,
          currency: 'USD'
        },
        capacity: {
          guests: 6,
          bedrooms: 3,
          beds: 4,
          bathrooms: 2.5
        },
        amenities: ['wifi', 'hot_tub', 'fireplace', 'kitchen', 'free_parking', 'heating'],
        guestFavorite: true,
        rating: { average: 4.94, count: 76, cleanliness: 5.0, accuracy: 4.9, communication: 5.0, location: 5.0, checkIn: 4.9, value: 4.8 },
        status: 'active'
      },
      {
        host: users[1]._id,
        title: 'Joshua Tree Mirror Stargazing Dome',
        description:
          'Secluded architectural geodesic dome nestled among giant boulder formations. Gaze directly at the Milky Way through the expansive skylight from your plush king-sized bed.',
        propertyType: 'dome',
        roomType: 'entire_place',
        category: 'omg',
        location: {
          address: '61400 Desert Star Rd',
          city: 'Joshua Tree',
          state: 'California',
          country: 'United States',
          zipCode: '92252',
          coordinates: { type: 'Point', coordinates: [-116.3131, 34.1347] }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1200',
            caption: 'Geodesic dome under desert night sky',
            isPrimary: true
          }
        ],
        price: {
          basePrice: 195,
          cleaningFee: 60,
          serviceFee: 50,
          taxes: 45,
          currency: 'USD'
        },
        capacity: {
          guests: 2,
          bedrooms: 1,
          beds: 1,
          bathrooms: 1
        },
        amenities: ['wifi', 'air_conditioning', 'heating', 'free_parking', 'bbq_grill'],
        guestFavorite: true,
        rating: { average: 4.95, count: 210, cleanliness: 4.9, accuracy: 5.0, communication: 5.0, location: 5.0, checkIn: 5.0, value: 4.8 },
        status: 'active'
      },
      {
        host: users[2]._id,
        title: 'Redwood Sanctuary Canopy Treehouse',
        description:
          'Built 35 feet up into a cathedral of ancient redwoods. Enjoy suspension bridges, an open-air cedar soak tub, and organic pour-over coffee among birdsong.',
        propertyType: 'treehouse',
        roomType: 'entire_place',
        category: 'tiny_homes',
        location: {
          address: '400 Mountain Trail',
          city: 'Santa Cruz',
          state: 'California',
          country: 'United States',
          zipCode: '95060',
          coordinates: { type: 'Point', coordinates: [-122.0308, 36.9741] }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
            caption: 'Treehouse in the redwoods',
            isPrimary: true
          }
        ],
        price: {
          basePrice: 175,
          cleaningFee: 50,
          serviceFee: 40,
          taxes: 38,
          currency: 'USD'
        },
        capacity: {
          guests: 2,
          bedrooms: 1,
          beds: 1,
          bathrooms: 1
        },
        amenities: ['wifi', 'heating', 'free_parking'],
        guestFavorite: true,
        rating: { average: 4.97, count: 320, cleanliness: 5.0, accuracy: 5.0, communication: 5.0, location: 5.0, checkIn: 5.0, value: 4.9 },
        status: 'active'
      },
      {
        host: users[1]._id,
        title: 'Candolim Private Infinity Pool Villa & Tropical Garden',
        description:
          'Step into paradise in North Goa. Features a breathtaking private saltwater swimming pool, lush swaying palm trees, open-air cabana, and only a 5-minute stroll to the golden sands of Candolim beach.',
        propertyType: 'villa',
        roomType: 'entire_place',
        category: 'pools',
        location: {
          address: 'Fort Aguada Rd, Candolim',
          city: 'Goa',
          state: 'Goa',
          country: 'India',
          zipCode: '403515',
          coordinates: { type: 'Point', coordinates: [73.7667, 15.5173] }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200',
            caption: 'Luxury private pool villa in Goa',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
            caption: 'Sunlit pool loungers'
          }
        ],
        price: {
          basePrice: 165,
          cleaningFee: 40,
          serviceFee: 30,
          taxes: 25,
          currency: 'USD'
        },
        capacity: {
          guests: 6,
          bedrooms: 3,
          beds: 3,
          bathrooms: 3
        },
        amenities: ['wifi', 'pool', 'air_conditioning', 'kitchen', 'beach_access', 'free_parking'],
        guestFavorite: true,
        rating: { average: 4.96, count: 88, cleanliness: 5.0, accuracy: 5.0, communication: 5.0, location: 4.9, checkIn: 5.0, value: 4.9 },
        status: 'active'
      },
      {
        host: users[2]._id,
        title: 'Heritage Portuguese Estate with Courtyard & Pool',
        description:
          'Restored 18th-century Portuguese estate in Assagao, Goa. Features high vaulted wooden ceilings, private lap pool, fragrant frangipani courtyards, and bespoke antique decor.',
        propertyType: 'villa',
        roomType: 'entire_place',
        category: 'mansions',
        location: {
          address: 'Badem Rd, Assagao',
          city: 'Goa',
          state: 'Goa',
          country: 'India',
          zipCode: '403507',
          coordinates: { type: 'Point', coordinates: [73.7845, 15.5912] }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200',
            caption: 'Private pool and historic Goan estate',
            isPrimary: true
          }
        ],
        price: {
          basePrice: 240,
          cleaningFee: 60,
          serviceFee: 45,
          taxes: 35,
          currency: 'USD'
        },
        capacity: {
          guests: 8,
          bedrooms: 4,
          beds: 5,
          bathrooms: 4
        },
        amenities: ['wifi', 'pool', 'air_conditioning', 'kitchen', 'free_parking', 'workspace'],
        guestFavorite: true,
        rating: { average: 4.94, count: 54, cleanliness: 4.9, accuracy: 5.0, communication: 5.0, location: 4.9, checkIn: 4.9, value: 4.9 },
        status: 'active'
      },
      {
        host: users[0]._id,
        title: 'Santorini Cliffside Cave Suite & Plunge Pool',
        description:
          'Dramatic cliffside cave house suite with private heated plunge pool carved into the volcanic rock in Oia, Santorini. Uninterrupted sunset caldera vistas.',
        propertyType: 'villa',
        roomType: 'entire_place',
        category: 'pools',
        location: {
          address: 'Oia Caldera Walkway',
          city: 'Santorini',
          state: 'Cyclades',
          country: 'Greece',
          zipCode: '84702',
          coordinates: { type: 'Point', coordinates: [25.3753, 36.4618] }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200',
            caption: 'Santorini plunge pool overlooking caldera',
            isPrimary: true
          }
        ],
        price: {
          basePrice: 510,
          cleaningFee: 150,
          serviceFee: 160,
          taxes: 120,
          currency: 'USD'
        },
        capacity: {
          guests: 4,
          bedrooms: 2,
          beds: 2,
          bathrooms: 2
        },
        amenities: ['wifi', 'pool', 'hot_tub', 'air_conditioning', 'workspace'],
        guestFavorite: true,
        rating: { average: 4.99, count: 215, cleanliness: 5.0, accuracy: 5.0, communication: 5.0, location: 5.0, checkIn: 5.0, value: 4.9 },
        status: 'active'
      },
      {
        host: users[1]._id,
        title: 'Swiss Alpine Log Cabin & Sauna',
        description:
          'Authentic timber alpine cabin facing the Matterhorn in Zermatt. Enjoy a private cedar dry sauna, wood-burning hearth, and immediate hiking trail access.',
        propertyType: 'cabin',
        roomType: 'entire_place',
        category: 'cabins',
        location: {
          address: 'Oberdorfstrasse 12',
          city: 'Zermatt',
          state: 'Valais',
          country: 'Switzerland',
          zipCode: '3920',
          coordinates: { type: 'Point', coordinates: [7.7491, 45.9763] }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200',
            caption: 'Swiss alpine timber cabin',
            isPrimary: true
          }
        ],
        price: {
          basePrice: 320,
          cleaningFee: 110,
          serviceFee: 85,
          taxes: 75,
          currency: 'USD'
        },
        capacity: {
          guests: 5,
          bedrooms: 2,
          beds: 3,
          bathrooms: 2
        },
        amenities: ['wifi', 'fireplace', 'sauna', 'kitchen', 'heating'],
        guestFavorite: true,
        rating: { average: 4.92, count: 112, cleanliness: 5.0, accuracy: 4.9, communication: 4.9, location: 5.0, checkIn: 4.9, value: 4.8 },
        status: 'active'
      },
      {
        host: users[2]._id,
        title: 'Lake Como Private Villa with Boat Dock',
        description:
          'Stunning waterfront villa on Lake Como with panoramic views across Bellagio. Includes private motorboat dock, terraced olive garden, and outdoor dining pergola.',
        propertyType: 'villa',
        roomType: 'entire_place',
        category: 'lakefront',
        location: {
          address: 'Via Statale 14',
          city: 'Lake Como',
          state: 'Lombardy',
          country: 'Italy',
          zipCode: '22021',
          coordinates: { type: 'Point', coordinates: [9.2625, 45.9873] }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200',
            caption: 'Lake Como villa terrace',
            isPrimary: true
          }
        ],
        price: {
          basePrice: 650,
          cleaningFee: 180,
          serviceFee: 210,
          taxes: 160,
          currency: 'USD'
        },
        capacity: {
          guests: 8,
          bedrooms: 4,
          beds: 5,
          bathrooms: 4
        },
        amenities: ['wifi', 'pool', 'kitchen', 'free_parking', 'workspace', 'beach_access'],
        guestFavorite: true,
        rating: { average: 4.98, count: 68, cleanliness: 5.0, accuracy: 5.0, communication: 5.0, location: 5.0, checkIn: 5.0, value: 4.9 },
        status: 'active'
      },
      {
        host: users[0]._id,
        title: 'Bali Bamboo Eco-Villa in Tropical Rainforest',
        description:
          'Architectural marvel built entirely from treated bamboo, suspended above the Ayung River valley in Ubud. Open-air living, natural spring pool, and organic breakfast.',
        propertyType: 'villa',
        roomType: 'entire_place',
        category: 'tropical',
        location: {
          address: 'Jl. Raya Sayan',
          city: 'Ubud',
          state: 'Bali',
          country: 'Indonesia',
          zipCode: '80571',
          coordinates: { type: 'Point', coordinates: [115.2625, -8.5069] }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200',
            caption: 'Bamboo sanctuary in Bali',
            isPrimary: true
          }
        ],
        price: {
          basePrice: 210,
          cleaningFee: 50,
          serviceFee: 40,
          taxes: 30,
          currency: 'USD'
        },
        capacity: {
          guests: 4,
          bedrooms: 2,
          beds: 2,
          bathrooms: 2
        },
        amenities: ['wifi', 'pool', 'free_parking', 'workspace'],
        guestFavorite: true,
        rating: { average: 4.96, count: 180, cleanliness: 4.9, accuracy: 5.0, communication: 5.0, location: 5.0, checkIn: 5.0, value: 4.9 },
        status: 'active'
      }
    ]);

    console.log(`🏡 Created ${listings.length} listings`);

    // 3. Create Bookings (matching Confirm & Pay breakdown)
    const booking = await Booking.create({
      listing: listings[0]._id, // Villa Bellissima
      guest: users[3]._id, // Sarah Connor
      host: users[0]._id, // Marco Bellini
      checkIn: new Date('2026-06-10'),
      checkOut: new Date('2026-06-15'),
      guests: { adults: 2, children: 0, infants: 0, pets: 0 },
      pricing: {
        nightlyRate: 420,
        nights: 5,
        basePrice: 2100,
        cleaningFee: 150,
        serviceFee: 200,
        taxes: 180,
        discount: 0,
        totalPrice: 2630, // Exact total from roamly_confirm_and_pay
        currency: 'USD'
      },
      payment: {
        method: 'credit_card',
        schedule: 'pay_in_two',
        installments: [
          { amount: 1315, dueDate: new Date('2026-04-01'), status: 'completed' },
          { amount: 1315, dueDate: new Date('2026-05-25'), status: 'completed' }
        ],
        cardLast4: '4242',
        status: 'completed',
        transactionId: 'TXN_ROAMLY_BELLISSIMA_01',
        paidAt: new Date()
      },
      status: 'completed',
      hostMessage: 'Hello Marco! We are thrilled to celebrate our anniversary in your beautiful villa.',
      guestPhone: '+1-212-555-0188'
    });

    console.log('📅 Created sample booking (Villa Bellissima: $2,630)');

    // 4. Create Reviews
    await Review.create([
      {
        listing: listings[0]._id,
        booking: booking._id,
        reviewer: users[3]._id,
        ratings: {
          overall: 5,
          cleanliness: 5,
          accuracy: 5,
          communication: 5,
          location: 5,
          checkIn: 5,
          value: 5
        },
        comment:
          'Villa Bellissima surpassed every single expectation! The sunset over Positano from the infinity pool was an unforgettable memory. Marco was the most attentive and wonderful host imaginable.',
        hostResponse: {
          comment: 'Dear Sarah, hosting you both was an absolute joy! You are always welcome back to Positano.',
          respondedAt: new Date()
        }
      }
    ]);

    console.log('⭐ Created sample review and host response');

    // 5. Create Wishlists (matching Wishlists page collections)
    await Wishlist.create([
      {
        user: users[3]._id,
        name: 'Amalfi Coast Dream',
        description: 'Spectacular seaside villas in southern Italy',
        listings: [listings[0]._id],
        coverImages: [
          'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800'
        ],
        privacy: 'private'
      },
      {
        user: users[3]._id,
        name: 'Design Escapes & Cabins',
        description: 'Modern retreats and mountain hideaways',
        listings: [listings[2]._id, listings[3]._id, listings[4]._id],
        coverImages: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
        ],
        privacy: 'shared',
        collaborators: [users[1]._id]
      }
    ]);

    console.log('❤️  Created sample wishlists');

    console.log('\n=========================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=========================================');
    console.log('Test Accounts (Password for all: password123):');
    console.log(' • Host (Positano): marco@example.com');
    console.log(' • Host (Malibu):   alice@example.com');
    console.log(' • Host (SF):       david@example.com');
    console.log(' • Guest:           sarah@example.com');
    console.log(' • Admin:           admin@example.com\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

