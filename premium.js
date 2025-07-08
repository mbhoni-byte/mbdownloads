const User = require('../models/User');

exports.checkPremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if user has active premium subscription
    if (!user.isPremium) {
      return res.status(403).json({ 
        success: false, 
        message: 'Premium subscription required' 
      });
    }
    
    // For yearly subscriptions, check if expired
    if (user.premiumType === 'yearly' && user.premiumExpiry < new Date()) {
      user.isPremium = false;
      user.premiumType = 'none';
      await user.save();
      
      return res.status(403).json({ 
        success: false, 
        message: 'Your premium subscription has expired' 
      });
    }
    
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};