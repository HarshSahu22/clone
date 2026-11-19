import User from '../models/User.model.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user with email or phone
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, countryCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      countryCode: countryCode || 'US'
    });

    const token = generateToken(user._id, res);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isHost: user.isHost,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login with email & password
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id, res);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isHost: user.isHost,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login or register via Phone (matches frontend Roamly phone auth flow)
// @route   POST /api/auth/phone-login
export const phoneLogin = async (req, res, next) => {
  try {
    const { phone, countryCode } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    let user = await User.findOne({ phone });

    // If new user, create a temporary placeholder account
    if (!user) {
      const generatedEmail = `guest_${phone.replace(/\D/g, '') || Date.now()}@roamly.com`;
      user = await User.create({
        firstName: 'Guest',
        lastName: 'Traveler',
        email: generatedEmail,
        password: `roamly_phone_${Date.now()}`,
        phone,
        countryCode: countryCode || 'US'
      });
    }

    const token = generateToken(user._id, res);

    res.json({
      success: true,
      message: 'Phone login verified successfully',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isHost: user.isHost
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Social login simulation (Google, Apple, Facebook)
// @route   POST /api/auth/social
export const socialLogin = async (req, res, next) => {
  try {
    const { provider, email, name, avatar } = req.body;

    const userEmail = email || `${provider.toLowerCase()}_user_${Date.now()}@example.com`;
    let user = await User.findOne({ email: userEmail });

    if (!user) {
      const parts = (name || `${provider} User`).split(' ');
      user = await User.create({
        firstName: parts[0] || 'User',
        lastName: parts.slice(1).join(' ') || provider,
        email: userEmail,
        password: `social_pass_${Date.now()}`,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        isVerified: true,
        verification: { email: true, phone: false, identity: false }
      });
    }

    const token = generateToken(user._id, res);

    res.json({
      success: true,
      message: `Signed in with ${provider}`,
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        isHost: user.isHost
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('listings');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

