require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadAllPinataFiles(downloadDirectory = './pinata-downloads') {
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
        console.log(`Found ${totalPins} files to download`);

        if (totalPins === 0) {
            console.log('No files to download');
            return {
                success: true,
                downloadedCount: 0,
                failedCount: 0
            };
        }

        // Create download directory if it doesn't exist
        if (!fs.existsSync(downloadDirectory)) {
            fs.mkdirSync(downloadDirectory, { recursive: true });
        }

        let downloadedCount = 0;
        let failedCount = 0;
        const failedDownloads = [];

        for (const pin of pinsResponse.data.rows) {
            try {
                const fileName = pin.metadata?.name || pin.ipfs_pin_hash;
                const filePath = path.join(downloadDirectory, fileName);

                console.log(`Downloading ${fileName}...`);

                const fileResponse = await pinataClient.get(
                    `https://api.pinata.cloud/data/pinGet/${pin.ipfs_pin_hash}`,
                    { responseType: 'stream' }
                );

                const writer = fs.createWriteStream(filePath);
                fileResponse.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });

                console.log(`✓ Successfully downloaded ${fileName}`);
                downloadedCount++;
            } catch (downloadError) {
                console.error(`✗ Failed to download ${pin.metadata?.name || pin.ipfs_pin_hash}: ${downloadError.message}`);
                failedCount++;
                failedDownloads.push({
                    name: pin.metadata?.name || pin.ipfs_pin_hash,
                    error: downloadError.message
                });
            }
        }

        console.log('\n=== Download Summary ===');
        console.log(`Total files found: ${totalPins}`);
        console.log(`Successfully downloaded: ${downloadedCount}`);
        console.log(`Failed downloads: ${failedCount}`);

        if (failedDownloads.length > 0) {
            console.log('\nFailed downloads:');
            failedDownloads.forEach(failure => {
                console.log(`- ${failure.name}: ${failure.error}`);
            });
        }

        return {
            success: true,
            downloadedCount,
            failedCount,
            failedDownloads
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
    downloadAllPinataFiles()
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

module.exports = downloadAllPinataFiles;