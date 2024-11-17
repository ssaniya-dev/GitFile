const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uploadToPinata = require('./upload');
const deleteAllPinataFiles = require('./delete');

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

async function updatePinataFiles(sourcePath) {
    try {
        console.log('Starting Pinata files update process...');
        console.log('Step 1: Deleting all existing files from Pinata...');
        
        const deleteResult = await deleteAllPinataFiles();
        if (!deleteResult.success) {
            throw new Error(`Delete operation failed: ${deleteResult.error}`);
        }

        console.log(`Successfully deleted ${deleteResult.deletedCount} files from Pinata`);
        console.log('Step 2: Uploading new files to Pinata...');

        const uploadResult = await uploadToPinata(sourcePath);
        if (!uploadResult.success) {
            throw new Error(`Upload operation failed: ${uploadResult.error}`);
        }

        console.log(`Successfully uploaded ${uploadResult.successfulUploads} files to Pinata`);

        return {
            success: true,
            deletedCount: deleteResult.deletedCount,
            uploadedCount: uploadResult.successfulUploads,
            failedDeletions: deleteResult.failedDeletions || [],
            failedUploads: uploadResult.results ? 
                uploadResult.results.filter(r => r.status === 'failed') : []
        };
    } catch (error) {
        console.error('Error in updatePinataFiles:', error);
        return {
            success: false,
            error: error.message,
            details: error.stack
        };
    }
}

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

app.post('/git-update', async (req, res) => {
    try {
        const result = await updatePinataFiles(storageDir);
        if (result.success) {
            res.json({
                message: 'Pinata files updated successfully',
                details: {
                    deletedCount: result.deletedCount,
                    uploadedCount: result.uploadedCount,
                    failedDeletions: result.failedDeletions,
                    failedUploads: result.failedUploads
                }
            });
        } else {
            res.status(500).json({
                message: 'Failed to update Pinata files',
                error: result.error,
                details: result.details
            });
        }
    } catch (error) {
        console.error('Error in git-update endpoint:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ message: 'Internal server error', error: error.message });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});