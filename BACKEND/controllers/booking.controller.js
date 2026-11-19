import Booking from '../models/Booking.model.js';
import Listing from '../models/Listing.model.js';

// @desc    Create and confirm booking (matches Confirm & Pay page flow)
// @route   POST /api/bookings
export const createBooking = async (req, res, next) => {
  try {
    const {
      listingId,
      checkIn,
      checkOut,
      guests,
      paymentMethod,
      paymentSchedule,
      cardLast4,
      hostMessage,
      guestPhone
    } = req.body;

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
        message: "You cannot book your own listing"
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Check for conflicting bookings
    const conflict = await Booking.findOne({
      listing: listingId,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ]
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'These dates are no longer available. Please select different dates.'
      });
    }

    // Calculate nights & pricing exactly matching the Airbnb / Roamly formula
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    if (nights < (listing.availability?.minNights || 1)) {
      return res.status(400).json({
        success: false,
        message: `Minimum stay is ${listing.availability.minNights} nights`
      });
    }

    const nightlyRate = listing.price.basePrice;
    const basePrice = nightlyRate * nights;

    let discount = 0;
    if (nights >= 28 && listing.price.monthlyDiscount) {
      discount = Math.round(basePrice * (listing.price.monthlyDiscount / 100));
    } else if (nights >= 7 && listing.price.weeklyDiscount) {
      discount = Math.round(basePrice * (listing.price.weeklyDiscount / 100));
    }

    const cleaningFee = listing.price.cleaningFee || 150;
    const serviceFee = listing.price.serviceFee || Math.round(basePrice * 0.12);
    const taxes = listing.price.taxes || Math.round((basePrice - discount + cleaningFee + serviceFee) * 0.1);
    const totalPrice = basePrice - discount + cleaningFee + serviceFee + taxes;

    // Handle split payment schedule (pay_in_two vs pay_in_full)
    const schedule = paymentSchedule === 'pay_in_two' ? 'pay_in_two' : 'pay_in_full';
    let installments = [];

    if (schedule === 'pay_in_two') {
      const halfPrice = Math.round((totalPrice / 2) * 100) / 100;
      installments = [
        {
          amount: halfPrice,
          dueDate: new Date(),
          status: 'completed'
        },
        {
          amount: totalPrice - halfPrice,
          dueDate: new Date(checkInDate.getTime() - 14 * 24 * 60 * 60 * 1000), // 2 weeks before check-in
          status: 'pending'
        }
      ];
    } else {
      installments = [
        {
          amount: totalPrice,
          dueDate: new Date(),
          status: 'completed'
        }
      ];
    }

    const booking = await Booking.create({
      listing: listingId,
      guest: req.user._id,
      host: listing.host,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests || { adults: 1, children: 0, infants: 0, pets: 0 },
      pricing: {
        nightlyRate,
        nights,
        basePrice,
        cleaningFee,
        serviceFee,
        taxes,
        discount,
        totalPrice,
        currency: listing.price.currency || 'USD'
      },
      payment: {
        method: paymentMethod || 'credit_card',
        schedule,
        installments,
        cardLast4: cardLast4 || '4242',
        status: 'completed',
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        paidAt: new Date()
      },
      status: 'confirmed',
      hostMessage: hostMessage || '',
      guestPhone: guestPhone || req.user.phone || ''
    });

    await booking.populate([
      { path: 'listing', select: 'title images location price' },
      { path: 'host', select: 'firstName lastName avatar' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking successfully confirmed!',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's trips (as guest)
// @route   GET /api/bookings/my-trips
export const getMyBookings = async (req, res, next) => {
  try {
    const filter = { guest: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const bookings = await Booking.find(filter)
      .populate('listing', 'title images location price rating')
      .populate('host', 'firstName lastName avatar')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get host's incoming reservations
// @route   GET /api/bookings/host-reservations
export const getHostReservations = async (req, res, next) => {
  try {
    const filter = { host: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const bookings = await Booking.find(filter)
      .populate('listing', 'title images location')
      .populate('guest', 'firstName lastName avatar email phone')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing')
      .populate('guest', 'firstName lastName avatar email phone')
      .populate('host', 'firstName lastName avatar email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const isGuest = booking.guest._id.toString() === req.user._id.toString();
    const isHost = booking.host._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isGuest && !isHost && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const isGuest = booking.guest.toString() === req.user._id.toString();
    const isHost = booking.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isGuest && !isHost && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking that is already ${booking.status}`
      });
    }

    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledBy: req.user._id,
      cancelledAt: new Date(),
      reason: req.body.reason || 'Requested by user',
      refundAmount: booking.pricing.totalPrice
    };
    booking.payment.status = 'refunded';

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

