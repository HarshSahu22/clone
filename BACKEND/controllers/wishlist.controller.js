import Wishlist from '../models/Wishlist.model.js';

// @desc    Get user's wishlists with optional filter & sort (matches Wishlists page)
// @route   GET /api/wishlists
export const getWishlists = async (req, res, next) => {
  try {
    const { filter = 'all', sort = 'recent' } = req.query;

    const query = {
      $or: [{ user: req.user._id }, { collaborators: req.user._id }]
    };

    if (filter === 'shared') {
      query.privacy = 'shared';
    } else if (filter === 'archived') {
      query.isArchived = true;
    } else {
      query.isArchived = false;
    }

    let sortOption = { updatedAt: -1 };
    if (sort === 'alpha') {
      sortOption = { name: 1 };
    } else if (sort === 'most_stays') {
      sortOption = { listings: -1 };
    }

    const wishlists = await Wishlist.find(query)
      .populate({
        path: 'listings',
        select: 'title images price location rating guestFavorite',
        options: { limit: 4 }
      })
      .populate('collaborators', 'firstName lastName avatar')
      .sort(sortOption);

    res.json({
      success: true,
      count: wishlists.length,
      wishlists
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single wishlist with all populated listings
// @route   GET /api/wishlists/:id
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id)
      .populate({
        path: 'listings',
        populate: {
          path: 'host',
          select: 'firstName lastName avatar isSuperhost'
        }
      })
      .populate('collaborators', 'firstName lastName avatar');

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    const isOwner = wishlist.user.toString() === req.user._id.toString();
    const isCollab = wishlist.collaborators.some(
      (c) => c._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollab && wishlist.privacy === 'private') {
      return res.status(403).json({
        success: false,
        message: 'This wishlist is private'
      });
    }

    res.json({
      success: true,
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new wishlist
// @route   POST /api/wishlists
export const createWishlist = async (req, res, next) => {
  try {
    const { name, description, privacy, listingId } = req.body;

    const wishlist = await Wishlist.create({
      user: req.user._id,
      name: name || 'My Collection',
      description: description || '',
      privacy: privacy || 'private',
      listings: listingId ? [listingId] : []
    });

    res.status(201).json({
      success: true,
      message: 'Wishlist created successfully',
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add listing to wishlist
// @route   POST /api/wishlists/:id/listings/:listingId
export const addListingToWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    const isOwner = wishlist.user.toString() === req.user._id.toString();
    const isCollab = wishlist.collaborators.some(
      (c) => c.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollab) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this wishlist'
      });
    }

    const listingIdStr = req.params.listingId;
    if (wishlist.listings.some((id) => id.toString() === listingIdStr)) {
      return res.status(400).json({
        success: false,
        message: 'Listing is already in this wishlist'
      });
    }

    wishlist.listings.push(listingIdStr);
    await wishlist.save();

    res.json({
      success: true,
      message: 'Added to wishlist',
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove listing from wishlist
// @route   DELETE /api/wishlists/:id/listings/:listingId
export const removeListingFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.listings = wishlist.listings.filter(
      (id) => id.toString() !== req.params.listingId
    );
    await wishlist.save();

    res.json({
      success: true,
      message: 'Removed from wishlist',
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle archive wishlist
// @route   PUT /api/wishlists/:id/archive
export const toggleArchive = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.isArchived = !wishlist.isArchived;
    await wishlist.save();

    res.json({
      success: true,
      message: wishlist.isArchived ? 'Wishlist archived' : 'Wishlist restored',
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete wishlist
// @route   DELETE /api/wishlists/:id
export const deleteWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    if (wishlist.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this wishlist'
      });
    }

    await wishlist.deleteOne();

    res.json({
      success: true,
      message: 'Wishlist deleted'
    });
  } catch (error) {
    next(error);
  }
};

