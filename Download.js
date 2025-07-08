const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  platform: {
    type: String,
    enum: ['youtube', 'facebook', 'instagram', 'twitter', 'tiktok'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  downloadUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Download', downloadSchema);