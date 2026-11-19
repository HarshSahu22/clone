import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ratings: {
      overall: { type: Number, required: true, min: 1, max: 5 },
      cleanliness: { type: Number, default: 5, min: 1, max: 5 },
      accuracy: { type: Number, default: 5, min: 1, max: 5 },
      communication: { type: Number, default: 5, min: 1, max: 5 },
      location: { type: Number, default: 5, min: 1, max: 5 },
      checkIn: { type: Number, default: 5, min: 1, max: 5 },
      value: { type: Number, default: 5, min: 1, max: 5 }
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: 2000
    },
    hostResponse: {
      comment: String,
      respondedAt: Date
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.index({ listing: 1, createdAt: -1 });

reviewSchema.statics.calcAverageRatings = async function (listingId) {
  const stats = await this.aggregate([
    { $match: { listing: new mongoose.Types.ObjectId(listingId) } },
    {
      $group: {
        _id: '$listing',
        count: { $sum: 1 },
        avgOverall: { $avg: '$ratings.overall' },
        avgCleanliness: { $avg: '$ratings.cleanliness' },
        avgAccuracy: { $avg: '$ratings.accuracy' },
        avgCommunication: { $avg: '$ratings.communication' },
        avgLocation: { $avg: '$ratings.location' },
        avgCheckIn: { $avg: '$ratings.checkIn' },
        avgValue: { $avg: '$ratings.value' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Listing').findByIdAndUpdate(listingId, {
      rating: {
        average: Math.round(stats[0].avgOverall * 10) / 10,
        count: stats[0].count,
        cleanliness: Math.round(stats[0].avgCleanliness * 10) / 10,
        accuracy: Math.round(stats[0].avgAccuracy * 10) / 10,
        communication: Math.round(stats[0].avgCommunication * 10) / 10,
        location: Math.round(stats[0].avgLocation * 10) / 10,
        checkIn: Math.round(stats[0].avgCheckIn * 10) / 10,
        value: Math.round(stats[0].avgValue * 10) / 10
      }
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.listing);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;

