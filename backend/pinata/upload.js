require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function uploadToPinata(sourcePath) {
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

        async function getAllFiles(dir) {
            const files = await fs.readdir(dir);
            const filePaths = [];

            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = await fs.stat(filePath);

                if (stat.isDirectory()) {
                    filePaths.push(...(await getAllFiles(filePath)));
                } else {
                    filePaths.push(filePath);
                }
            }

            return filePaths;
        }

        const stats = await fs.stat(sourcePath);
        const files = stats.isDirectory() ? await getAllFiles(sourcePath) : [sourcePath];
        const uploadResults = [];

        const parentDir = path.dirname(sourcePath);
        const rootFolderName = path.basename(sourcePath);

        console.log(`Found ${files.length} files to upload`);

        for (const filePath of files) {
            const formData = new FormData();
            
            let relativePath;
            if (stats.isDirectory()) {
                relativePath = path.relative(parentDir, filePath);
            } else {
                relativePath = path.basename(filePath);
            }
            
            relativePath = relativePath.replace(/\.git/g, 'git');
            
            const content = await fs.readFile(filePath);
            
            formData.append('file', content, {
                filepath: relativePath,
                contentType: 'application/octet-stream'
            });

            const options = {
                pinataMetadata: {
                    name: relativePath
                },
                pinataOptions: {
                    cidVersion: 0
                }
            };

            formData.append('pinataOptions', JSON.stringify(options));

            try {
                console.log(`Uploading ${relativePath}...`);
                const response = await pinataClient.post(
                    'https://api.pinata.cloud/pinning/pinFileToIPFS',
                    formData,
                    {
                        maxBodyLength: 'Infinity',
                        headers: {
                            ...formData.getHeaders()
                        }
                    }
                );

                uploadResults.push({
                    path: relativePath,
                    ipfsHash: response.data.IpfsHash,
                    status: 'success'
                });

                console.log(`✓ Successfully uploaded ${relativePath}`);
                console.log(`  IPFS Hash: ${response.data.IpfsHash}`);
                console.log(`  Gateway URL: https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
                console.log('');
            } catch (uploadError) {
                console.error('Upload error details:', uploadError.response?.data || uploadError.message);
                uploadResults.push({
                    path: relativePath,
                    error: uploadError.response?.data?.error || uploadError.message,
                    status: 'failed'
                });
                console.error(`✗ Failed to upload ${relativePath}: ${uploadError.message}\n`);
            }
        }

        const successfulUploads = uploadResults.filter(r => r.status === 'success');
        console.log('\n=== Upload Summary ===');
        console.log(`Total files processed: ${files.length}`);
        console.log(`Successfully uploaded: ${successfulUploads.length}`);
        console.log(`Failed uploads: ${files.length - successfulUploads.length}`);

        if (successfulUploads.length > 0) {
            console.log('\nSuccessful uploads:');
            successfulUploads.forEach(result => {
                console.log(`- ${result.path} -> ${result.ipfsHash}`);
            });
        }

        const failedUploads = uploadResults.filter(r => r.status === 'failed');
                    if (failedUploads.length > 0) {
                console.log('\nFailed uploads:');
                failedUploads.forEach(result => {
                    console.log(`- ${result.path}: ${result.error}`);
                });
            }

            return {
                success: true,
                results: uploadResults,
                totalFiles: files.length,
                successfulUploads: successfulUploads.length
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
        const sourcePath = process.argv[2];
        
        if (!sourcePath) {
            console.error('Please provide a source path as an argument');
            console.error('Usage: node script.js <path-to-file-or-directory>');
            process.exit(1);
        }

        uploadToPinata(sourcePath)
            .then(result => {
                if (!result.success) {
                    console.error('Upload failed:', result.error);
                    process.exit(1);
                }
                process.exit(0);
            })
            .catch(error => {
                console.error('Upload failed:', error);
                process.exit(1);
            });
    }

    module.exports = uploadToPinata;