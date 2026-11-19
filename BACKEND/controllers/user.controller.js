import User from '../models/User.model.js';
import Booking from '../models/Booking.model.js';

// @desc    Get user public profile
// @route   GET /api/users/:id
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('firstName lastName avatar bio work location languages isHost isSuperhost isVerified verification createdAt')
      .populate('listings');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'firstName',
      'lastName',
      'phone',
      'bio',
      'work',
      'location',
      'languages',
      'avatar',
      'emergencyContact',
      'notifications'
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user bio directly (matches profile page inline bio editor)
// @route   PUT /api/users/bio
export const updateBio = async (req, res, next) => {
  try {
    const { bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio: bio || '' },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Bio updated',
      bio: user.bio
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password does not match'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Switch or upgrade user to host
// @route   PUT /api/users/become-host
export const becomeHost = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isHost: true, role: 'host' },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Congratulations! You are now a host on Roamly.',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get account activity
// @route   GET /api/users/activity
export const getActivity = async (req, res, next) => {
  try {
    const recentBookings = await Booking.find({ guest: req.user._id })
      .populate('listing', 'title images location')
      .sort('-createdAt')
      .limit(5);

    res.json({
      success: true,
      activity: {
        recentBookings,
        loginAlerts: [
          { device: 'Chrome on Windows', location: 'Current Session', time: new Date() }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });

    res.json({
      success: true,
      message: 'Account permanently deleted'
    });
  } catch (error) {
    next(error);
  }
};

