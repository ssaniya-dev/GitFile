const uploadToPinata = require('./upload');
const deleteAllPinataFiles = require('./delete');

async function updatePinataFiles(sourcePath) {
    try {
        console.log('Deleting all files from Pinata...');
        const deleteResult = await deleteAllPinataFiles();

        if (!deleteResult.success) {
            throw new Error(`Failed to delete files: ${deleteResult.error}`);
        }

        console.log(`Deleted ${deleteResult.deletedCount} files from Pinata`);

        console.log('Uploading new files to Pinata...');
        const uploadResult = await uploadToPinata(sourcePath);

        if (!uploadResult.success) {
            throw new Error(`Failed to upload files: ${uploadResult.error}`);
        }

        console.log(`Uploaded ${uploadResult.successfulUploads} files to Pinata`);

        return {
            success: true,
            deletedCount: deleteResult.deletedCount,
            uploadedCount: uploadResult.successfulUploads
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = updatePinataFiles;