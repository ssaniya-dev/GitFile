const express = require('express');
const updatePinataFiles = require('./delete_upload');

const app = express();

// Add body-parser middleware
app.use(express.json());

app.post('/update-pinata-files', async (req, res) => {
    try {
        const { sourcePath } = req.body;

        // Basic input validation
        if (!sourcePath) {
            return res.status(400).json({ 
                success: false, 
                error: 'sourcePath is required in the request body' 
            });
        }

        const result = await updatePinataFiles(sourcePath);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ 
                success: false, 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});