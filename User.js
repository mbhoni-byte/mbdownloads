const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumType: {
    type: String,
    enum: ['none', 'yearly', 'lifetime'],
    default: 'none'
  },
  premiumExpiry: Date,
  downloads: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);