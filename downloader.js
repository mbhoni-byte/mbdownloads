const ytdl = require('ytdl-core');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// YouTube downloader
const downloadYouTube = async (url) => {
  const videoInfo = await ytdl.getInfo(url);
  const format = ytdl.chooseFormat(videoInfo.formats, { quality: 'highest' });
  return format.url;
};

// TikTok downloader (without watermark)
const downloadTikTok = async (url) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(__dirname, '../temp', `${Date.now()}.mp4`);
    exec(`yt-dlp -f "best" -o "${outputPath}" "${url}" --no-check-certificate`, async (err) => {
      if (err) {
        console.error('Error downloading TikTok:', err);
        return reject('Failed to download TikTok video');
      }

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(outputPath, {
          resource_type: 'video',
          folder: 'mbdownloads'
        });
        
        // Delete temp file
        fs.unlinkSync(outputPath);
        
        resolve(result.secure_url);
      } catch (uploadErr) {
        console.error('Error uploading to Cloudinary:', uploadErr);
        reject('Failed to process video');
      }
    });
  });
};

// Generic downloader for other platforms
const downloadGeneric = async (url, platform) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(__dirname, '../temp', `${Date.now()}.mp4`);
    exec(`yt-dlp -f "best" -o "${outputPath}" "${url}" --no-check-certificate`, async (err) => {
      if (err) {
        console.error(`Error downloading ${platform}:`, err);
        return reject(`Failed to download ${platform} video`);
      }

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(outputPath, {
          resource_type: 'video',
          folder: 'mbdownloads'
        });
        
        // Delete temp file
        fs.unlinkSync(outputPath);
        
        resolve(result.secure_url);
      } catch (uploadErr) {
        console.error('Error uploading to Cloudinary:', uploadErr);
        reject('Failed to process video');
      }
    });
  });
};

module.exports = {
  downloadYouTube,
  downloadTikTok,
  downloadGeneric
};