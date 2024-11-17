require('dotenv').config();
const axios = require('axios');

async function deleteAllPinataFiles() {
    const apiKey = process.env.PINATA_API_KEY;
    const apiSecret = process.env.PINATA_API_SECRET;
    
    if (!apiKey || !apiSecret) {
        throw new Error('PINATA_API_KEY and PINATA_API_SECRET must be set in environment variables');
    }

    try {
        const pinataClient = axios.create({
            headers: {
                'pinata_api_key': apiKey,
                'pinata_secret_api_key': apiSecret
            }
        });

        console.log('Fetching list of pinned files...');

        const pinsResponse = await pinataClient.get(
            'https://api.pinata.cloud/data/pinList?status=pinned'
        );

        const totalPins = pinsResponse.data.rows.length;
        console.log(`Found ${totalPins} files to delete`);

        if (totalPins === 0) {
            console.log('No files to delete');
            return {
                success: true,
                deletedCount: 0,
                failedCount: 0
            };
        }

        let deletedCount = 0;
        let failedCount = 0;
        const failedDeletions = [];

        for (const pin of pinsResponse.data.rows) {
            try {
                console.log(`Deleting ${pin.metadata?.name || pin.ipfs_pin_hash}...`);
                
                await pinataClient.delete(
                    `https://api.pinata.cloud/pinning/unpin/${pin.ipfs_pin_hash}`
                );

                console.log(`✓ Successfully deleted ${pin.metadata?.name || pin.ipfs_pin_hash}`);
                deletedCount++;
            } catch (deleteError) {
                console.error(`✗ Failed to delete ${pin.metadata?.name || pin.ipfs_pin_hash}: ${deleteError.message}`);
                failedCount++;
                failedDeletions.push({
                    name: pin.metadata?.name || pin.ipfs_pin_hash,
                    error: deleteError.message
                });
            }
        }

        console.log('\n=== Deletion Summary ===');
        console.log(`Total files found: ${totalPins}`);
        console.log(`Successfully deleted: ${deletedCount}`);
        console.log(`Failed deletions: ${failedCount}`);

        if (failedDeletions.length > 0) {
            console.log('\nFailed deletions:');
            failedDeletions.forEach(failure => {
                console.log(`- ${failure.name}: ${failure.error}`);
            });
        }

        return {
            success: true,
            deletedCount,
            failedCount,
            failedDeletions
        };

    } catch (error) {
        console.error('Error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

if (require.main === module) {
    deleteAllPinataFiles()
        .then(result => {
            if (!result.success) {
                console.error('Operation failed:', result.error);
                process.exit(1);
            }
            process.exit(0);
        })
        .catch(error => {
            console.error('Operation failed:', error);
            process.exit(1);
        });
}

module.exports = deleteAllPinataFiles;  