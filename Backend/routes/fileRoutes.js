const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Upload file endpoint
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`; // Send back the file URL
  res.status(200).json({ message: 'File uploaded successfully', file: { path: fileUrl } });
});

// Remove background endpoint
router.post('/removebg', async (req, res) => {
  const { imageUrl } = req.body;

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY,
        'Content-Type': 'application/json',
      },
      data: {
        image_url: imageUrl,
        size: 'auto',
      },
      responseType: 'arraybuffer',
    });

    const outputPath = path.join(__dirname, '../uploads', 'bg_removed_image.png'); // Change the output path as needed
    fs.writeFileSync(outputPath, response.data);

    const resultImageUrl = `http://localhost:5000/uploads/bg_removed_image.png`; // Return this URL for downloading
    res.status(200).json({ imageUrl: resultImageUrl });
  } catch (error) {
    console.error('Error removing background:', error);
    res.status(500).json({ message: 'Background removal failed' });
  }
});

module.exports = router;
