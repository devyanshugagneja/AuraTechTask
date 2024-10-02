const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});

const upload = multer({ storage: storage }).single('file');

// Function to remove background from the image
const removeBackground = async (filePath) => {
  const apiKey = process.env.REMOVE_BG_API_KEY; // Add your API key to .env
  const formData = new FormData();
  formData.append('image_file', fs.createReadStream(filePath));

  try {
    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        'X-Api-Key': apiKey,
        ...formData.getHeaders(),
      },
    });

    // Save the manipulated image to a new file
    const outputFilePath = path.join(__dirname, 'uploads', 'output_' + Date.now() + '.png');
    fs.writeFileSync(outputFilePath, response.data);
    return outputFilePath; // Return the new file path
  } catch (error) {
    console.error('Error removing background:', error);
    throw error; // Propagate the error
  }
};

// Upload and manipulate file
exports.uploadFile = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed.' });
    }

    try {
      const manipulatedImagePath = await removeBackground(req.file.path);
      res.status(200).json({ message: 'File uploaded and background removed.', imageUrl: manipulatedImagePath });
    } catch (error) {
      res.status(500).json({ error: 'Error removing background.' });
    } finally {
      // Clean up uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete uploaded file:', err);
      });
    }
  });
};

// Remove background from the uploaded file
exports.removeBg = async (req, res) => {
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
};
