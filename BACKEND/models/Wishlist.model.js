import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Wishlist name is required'],
      trim: true,
      maxlength: 50
    },
    description: {
      type: String,
      default: '',
      maxlength: 200
    },
    listings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
      }
    ],
    coverImages: [String],
    privacy: {
      type: String,
      enum: ['private', 'shared'],
      default: 'private'
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    isArchived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

wishlistSchema.index({ user: 1, isArchived: 1 });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;

