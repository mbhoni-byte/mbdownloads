const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { planType } = req.body;
    let amount;

    // Determine amount based on plan type
    switch (planType) {
      case 'yearly':
        amount = 500; // $5.00
        break;
      case 'lifetime':
        amount = 1500; // $15.00
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid plan type' });
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        userId: req.user.id,
        planType
      },
      payment_method_types: ['card'],
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.handlePaymentSuccess = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (!paymentIntent) {
      return res.status(400).json({ success: false, message: 'Payment not found' });
    }
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ success: false, message: 'Payment not succeeded' });
    }
    
    const userId = paymentIntent.metadata.userId;
    const planType = paymentIntent.metadata.planType;
    
    // Update user premium status
    const updateData = {
      isPremium: true,
      premiumType: planType
    };
    
    // Set expiry for yearly plan
    if (planType === 'yearly') {
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      updateData.premiumExpiry = oneYearLater;
    }
    
    await User.findByIdAndUpdate(userId, updateData);
    
    res.json({ success: true, message: 'Premium status updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};