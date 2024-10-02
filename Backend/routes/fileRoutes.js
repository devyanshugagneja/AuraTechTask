const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { uploadFile, removeBg } = require('../controllers/fileController'); // Adjust the path if necessary

const router = express.Router();

// Upload file endpoint
router.post('/upload', upload.single('file'), uploadFile);

// Remove background endpoint
router.post('/removebg', removeBg);

module.exports = router;
