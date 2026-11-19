import Listing from '../models/Listing.model.js';

// @desc    Calculate host earnings estimate (matches Host Your Home calculator)
// @route   GET /api/hosting/earnings-estimate
export const getEarningsEstimate = async (req, res, next) => {
  try {
    const {
      location = 'Positano, Italy',
      propertyType = 'entire_place',
      bedrooms = 2,
      nights = 7
    } = req.query;

    const numBedrooms = Math.max(1, parseInt(bedrooms, 10) || 1);
    const numNights = Math.max(1, Math.min(30, parseInt(nights, 10) || 7));

    // Base average rate per night
    let baseNightly = 180;

    // Location modifier
    const locLower = location.toLowerCase();
    if (locLower.includes('positano') || locLower.includes('malibu') || locLower.includes('new york') || locLower.includes('paris')) {
      baseNightly = 320;
    } else if (locLower.includes('aspen') || locLower.includes('san francisco') || locLower.includes('london')) {
      baseNightly = 260;
    } else if (locLower.includes('miami') || locLower.includes('tokyo') || locLower.includes('rome')) {
      baseNightly = 220;
    }

    // Property type multiplier (matches frontend DESIGN / HTML specs)
    let typeMultiplier = 1.0;
    if (propertyType === 'private_room') typeMultiplier = 0.65;
    if (propertyType === 'shared_room' || propertyType === 'shared_space') typeMultiplier = 0.4;

    // Bedroom multiplier
    let bedroomMultiplier = 1.0;
    if (numBedrooms === 2) bedroomMultiplier = 1.4;
    else if (numBedrooms === 3) bedroomMultiplier = 1.8;
    else if (numBedrooms >= 4) bedroomMultiplier = 2.3;

    const estimatedNightlyRate = Math.round(baseNightly * typeMultiplier * bedroomMultiplier);
    const monthlyEarnings = estimatedNightlyRate * numNights;
    const annualEarnings = monthlyEarnings * 12;

    res.json({
      success: true,
      calculation: {
        location,
        propertyType,
        bedrooms: numBedrooms,
        nightsPerMonth: numNights,
        estimatedNightlyRate,
        estimatedMonthlyEarnings: monthlyEarnings,
        estimatedAnnualEarnings: annualEarnings,
        currency: 'USD'
      }
    });
  } catch (error) {
    next(error);
  }
};

