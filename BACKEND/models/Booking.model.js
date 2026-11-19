import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required']
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required']
    },
    guests: {
      adults: { type: Number, required: true, min: 1, default: 1 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 },
      pets: { type: Number, default: 0 }
    },
    pricing: {
      nightlyRate: { type: Number, required: true },
      nights: { type: Number, required: true },
      basePrice: { type: Number, required: true },
      cleaningFee: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      totalPrice: { type: Number, required: true },
      currency: { type: String, default: 'USD' }
    },
    payment: {
      method: {
        type: String,
        enum: ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
        default: 'credit_card'
      },
      schedule: {
        type: String,
        enum: ['pay_in_full', 'pay_in_two'],
        default: 'pay_in_full'
      },
      installments: [
        {
          amount: Number,
          dueDate: Date,
          status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
          }
        }
      ],
      cardLast4: String,
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'completed'
      },
      transactionId: String,
      paidAt: {
        type: Date,
        default: Date.now
      }
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'declined'],
      default: 'confirmed'
    },
    hostMessage: {
      type: String,
      default: ''
    },
    guestPhone: {
      type: String,
      default: ''
    },
    cancellation: {
      cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      cancelledAt: Date,
      reason: String,
      refundAmount: Number
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.pre('validate', function (next) {
  if (this.checkOut <= this.checkIn) {
    this.invalidate('checkOut', 'Check-out date must be after check-in date');
  }
  next();
});

bookingSchema.index({ guest: 1, status: 1 });
bookingSchema.index({ host: 1, status: 1 });
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

