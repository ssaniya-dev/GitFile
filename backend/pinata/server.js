const express = require('express');
const updatePinataFiles = require('./delete_upload');

const app = express();

app.post('/update-pinata-files', async (req, res) => {
    const sourcePath = req.body.sourcePath;

    const result = await updatePinataFiles(sourcePath);

    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(500).json({ error: result.error });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});