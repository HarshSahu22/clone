import Review from '../models/Review.model.js';
import Booking from '../models/Booking.model.js';
import Listing from '../models/Listing.model.js';

// @desc    Get reviews for a listing
// @route   GET /api/reviews/listing/:listingId
export const getListingReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ listing: req.params.listingId })
      .populate('reviewer', 'firstName lastName avatar location createdAt')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ listing: req.params.listingId });

    res.json({
      success: true,
      count: reviews.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review
// @route   POST /api/reviews
export const createReview = async (req, res, next) => {
  try {
    const { listingId, bookingId, ratings, comment } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listing.host.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Hosts cannot review their own listings'
      });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      listing: listingId,
      reviewer: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this listing'
      });
    }

    const review = await Review.create({
      listing: listingId,
      booking: bookingId || null,
      reviewer: req.user._id,
      ratings: ratings || { overall: 5 },
      comment
    });

    await review.populate('reviewer', 'firstName lastName avatar location');

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Host responds to review
// @route   PUT /api/reviews/:id/respond
export const respondToReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const listing = await Listing.findById(review.listing);
    if (listing.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the listing host can respond to this review'
      });
    }

    review.hostResponse = {
      comment: req.body.comment,
      respondedAt: new Date()
    };

    await review.save();

    res.json({
      success: true,
      message: 'Response posted successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.reviewer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const listingId = review.listing;
    await review.deleteOne();
    await Review.calcAverageRatings(listingId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

