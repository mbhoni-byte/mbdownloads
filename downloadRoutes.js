const express = require('express');
const router = express.Router();
const { protect, checkPremium } = require('../middleware/auth');
const { processDownload } = require('../controllers/downloadController');

router.post('/', protect, checkPremium, processDownload);

module.exports = router;