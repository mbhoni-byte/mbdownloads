const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  createPaymentIntent, 
  handlePaymentSuccess 
} = require('../controllers/paymentController');

router.post('/create-intent', protect, createPaymentIntent);
router.post('/success', protect, handlePaymentSuccess);

module.exports = router;