const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3002;

const storageDir = '/home/azureuser/GitFile/backend/utd-warehouse';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    cb(null, storageDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

app.use(cors());

app.post('/save-pdf', upload.single('pdfFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(storageDir, req.file.originalname);
    
    res.json({
      message: `PDF saved as ${req.file.originalname}`,
      path: filePath
    });
  } catch (error) {
    console.error('Error handling PDF upload:', error);
    res.status(500).json({ message: 'Error saving PDF', error: error.message });
  }
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ message: 'Internal server error', error: error.message });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});