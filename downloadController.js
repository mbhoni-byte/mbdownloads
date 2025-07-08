const {
  downloadYouTube,
  downloadTikTok,
  downloadGeneric
} = require('../utils/downloader');
const Download = require('../models/Download');
const User = require('../models/User');

exports.processDownload = async (req, res) => {
  try {
    const { url } = req.body;
    const userId = req.user.id;

    // Detect platform
    let platform;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'youtube';
    } else if (url.includes('tiktok.com')) {
      platform = 'tiktok';
    } else if (url.includes('facebook.com')) {
      platform = 'facebook';
    } else if (url.includes('instagram.com')) {
      platform = 'instagram';
    } else if (url.includes('twitter.com')) {
      platform = 'twitter';
    } else {
      return res.status(400).json({ success: false, message: 'Unsupported platform' });
    }

    // Download based on platform
    let downloadUrl;
    try {
      if (platform === 'youtube') {
        downloadUrl = await downloadYouTube(url);
      } else if (platform === 'tiktok') {
        downloadUrl = await downloadTikTok(url);
      } else {
        downloadUrl = await downloadGeneric(url, platform);
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message || 'Download failed' });
    }

    // Record download in database
    const download = new Download({
      user: userId,
      platform,
      url,
      downloadUrl
    });
    await download.save();

    // Update user's download count
    await User.findByIdAndUpdate(userId, { $inc: { downloads: 1 } });

    res.json({ success: true, downloadUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};