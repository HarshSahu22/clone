import Listing from '../models/Listing.model.js';
import APIFeatures from '../utils/apiFeatures.js';

// @desc    Get all listings with filtering, search, sorting, and pagination
// @route   GET /api/listings
export const getListings = async (req, res, next) => {
  try {
    const conditions = [{ status: 'active' }];

    // Search query (keyword)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      conditions.push({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { 'location.city': searchRegex },
          { 'location.state': searchRegex },
          { 'location.country': searchRegex },
          { category: searchRegex }
        ]
      });
    }

    // Location specific filters
    if (req.query.city) {
      conditions.push({ 'location.city': new RegExp(req.query.city, 'i') });
    }
    if (req.query.country) {
      conditions.push({ 'location.country': new RegExp(req.query.country, 'i') });
    }

    // Category filter (flexible match against category or corresponding amenities/propertyType)
    if (req.query.category && req.query.category !== 'all') {
      const cat = req.query.category.toLowerCase().trim();
      if (cat === 'pools' || cat === 'amazing pools') {
        conditions.push({
          $or: [{ category: 'pools' }, { amenities: 'pool' }, { title: /pool/i }]
        });
      } else if (cat === 'cabins') {
        conditions.push({
          $or: [{ category: 'cabins' }, { propertyType: 'cabin' }, { title: /cabin/i }]
        });
      } else if (cat === 'beachfront') {
        conditions.push({
          $or: [{ category: 'beachfront' }, { amenities: 'beach_access' }, { title: /beach/i }]
        });
      } else if (cat === 'ski_in_out' || cat === 'ski-in/out') {
        conditions.push({
          $or: [{ category: 'ski_in_out' }, { amenities: 'ski_in_ski_out' }, { title: /ski|snow/i }]
        });
      } else if (cat === 'mansions') {
        conditions.push({
          $or: [{ category: 'mansions' }, { propertyType: 'villa' }, { title: /villa|mansion/i }]
        });
      } else if (cat === 'tiny_homes' || cat === 'tiny homes') {
        conditions.push({
          $or: [{ category: 'tiny_homes' }, { propertyType: 'treehouse' }, { title: /tiny|loft/i }]
        });
      } else if (cat === 'tropical') {
        conditions.push({
          $or: [{ category: 'tropical' }, { description: /tropical|palm|island/i }, { title: /tropical/i }]
        });
      } else if (cat === 'lakefront') {
        conditions.push({
          $or: [{ category: 'lakefront' }, { description: /lake/i }, { title: /lake/i }]
        });
      } else if (cat === 'omg') {
        conditions.push({
          $or: [{ category: 'omg' }, { guestFavorite: true }]
        });
      } else if (cat === 'countryside') {
        conditions.push({
          $or: [{ category: 'countryside' }, { description: /countryside|rural|mountain/i }]
        });
      } else if (cat === 'islands') {
        conditions.push({
          $or: [{ category: 'islands' }, { description: /island|ocean/i }, { title: /island/i }]
        });
      } else if (cat === 'icons') {
        conditions.push({
          $or: [{ category: 'icons' }, { guestFavorite: true }]
        });
      } else {
        conditions.push({
          $or: [
            { category: new RegExp(cat, 'i') },
            { title: new RegExp(cat, 'i') },
            { amenities: new RegExp(cat, 'i') }
          ]
        });
      }
    }

    // Type of place (Entire home, Room, etc.)
    if (req.query.roomType) {
      conditions.push({ roomType: req.query.roomType });
    }
    if (req.query.propertyType) {
      conditions.push({ propertyType: req.query.propertyType });
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
      conditions.push({ 'price.basePrice': priceFilter });
    }

    // Capacity filters
    if (req.query.guests) {
      conditions.push({ 'capacity.guests': { $gte: Number(req.query.guests) } });
    }
    if (req.query.bedrooms) {
      conditions.push({ 'capacity.bedrooms': { $gte: Number(req.query.bedrooms) } });
    }

    const filter = conditions.length > 1 ? { $and: conditions } : conditions[0];
    if (req.query.beds) {
      filter['capacity.beds'] = { $gte: Number(req.query.beds) };
    }
    if (req.query.bathrooms) {
      filter['capacity.bathrooms'] = { $gte: Number(req.query.bathrooms) };
    }

    // Amenities filter (comma-separated list: wifi,pool,kitchen)
    if (req.query.amenities) {
      const amenitiesList = req.query.amenities.split(',').map((a) => a.trim().toLowerCase());
      filter.amenities = { $all: amenitiesList };
    }

    // Booking options
    if (req.query.instantBook === 'true') {
      filter['availability.instantBook'] = true;
    }
    if (req.query.guestFavorite === 'true') {
      filter.guestFavorite = true;
    }

    // Count total matching listings before pagination
    const total = await Listing.countDocuments(filter);

    // Initialize APIFeatures for sorting, field limiting, and pagination
    const features = new APIFeatures(Listing.find(filter), req.query)
      .sort()
      .limitFields()
      .paginate();

    const listings = await features.query.populate(
      'host',
      'firstName lastName avatar isSuperhost isVerified'
    );

    res.json({
      success: true,
      count: listings.length,
      total,
      page: features.page,
      pages: Math.ceil(total / features.limit),
      listings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing with detailed host info and reviews
// @route   GET /api/listings/:id
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('host', 'firstName lastName avatar bio work location languages isSuperhost isVerified createdAt')
      .populate({
        path: 'reviews',
        populate: {
          path: 'reviewer',
          select: 'firstName lastName avatar location'
        },
        options: { sort: { createdAt: -1 }, limit: 20 }
      });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    res.json({
      success: true,
      listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories with icon names and count
// @route   GET /api/listings/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = [
      { id: 'beachfront', name: 'Beachfront', icon: 'beach_access' },
      { id: 'cabins', name: 'Cabins', icon: 'cabin' },
      { id: 'pools', name: 'Amazing pools', icon: 'pool' },
      { id: 'mansions', name: 'Mansions', icon: 'villa' },
      { id: 'tropical', name: 'Tropical', icon: 'palmtree' },
      { id: 'lakefront', name: 'Lakefront', icon: 'water' },
      { id: 'omg', name: 'OMG!', icon: 'auto_awesome' },
      { id: 'countryside', name: 'Countryside', icon: 'agriculture' },
      { id: 'ski_in_out', name: 'Ski-in/out', icon: 'downhill_skiing' },
      { id: 'islands', name: 'Islands', icon: 'island' },
      { id: 'tiny_homes', name: 'Tiny homes', icon: 'cottage' },
      { id: 'trending', name: 'Trending', icon: 'local_fire_department' },
      { id: 'icons', name: 'Icons', icon: 'star' }
    ];

    const counts = await Listing.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const categoriesWithCount = categories.map((cat) => ({
      ...cat,
      listingCount: countMap[cat.id] || 0
    }));

    res.json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new listing
// @route   POST /api/listings
export const createListing = async (req, res, next) => {
  try {
    req.body.host = req.user._id;

    if (!req.user.isHost && req.user.role !== 'admin') {
      req.user.isHost = true;
      await req.user.save();
    }

    const listing = await Listing.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
export const updateListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listing.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this listing'
      });
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Listing updated successfully',
      listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listing.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    await listing.deleteOne();

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get host's listings
// @route   GET /api/listings/my/listings
export const getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ host: req.user._id }).sort('-createdAt');
    res.json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    next(error);
  }
};

