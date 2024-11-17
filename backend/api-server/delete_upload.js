const uploadToPinata = require('./upload');
const deleteAllPinataFiles = require('./delete');

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

if (require.main === module) {
    const sourcePath = process.argv[2];
    if (!sourcePath) {
        console.error('Please provide a source path as an argument');
        process.exit(1);
    }

    updatePinataFiles(sourcePath)
        .then(result => {
            if (!result.success) {
                console.error('Update failed:', result.error);
                process.exit(1);
            }
            console.log('Update completed successfully');
            process.exit(0);
        })
        .catch(error => {
            console.error('Update failed:', error);
            process.exit(1);
        });
}

module.exports = updatePinataFiles;