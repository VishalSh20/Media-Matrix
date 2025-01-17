import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../config.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * @typedef {Object} MediaUploadResult
 * @property {string} key - The S3 object key
 * @property {string} filename - The filename of the uploaded file
 * @property {string} path - The relative path to the file
 * @property {number} timestamp - Upload timestamp
 * @property {string} prompt - Original prompt used for generation
 * @property {string} url - Signed URL for accessing the file
 * @property {string} bucket - S3 bucket name
 */

/**
 * Uploads media to S3 and returns a signed URL
 * @param {Buffer|string} imageBuffer - The image buffer to upload (base64 string or Buffer)
 * @param {string} prompt - The prompt used to generate the image
 * @param {number} index - The index of the image in a batch
 * @param {string} userId - The ID of the user uploading the image
 * @returns {Promise<MediaUploadResult>} The upload result with signed URL
 * @throws {Error} If upload fails
 */
async function uploadImage(imageBuffer, prompt, index, userId,extension="png") {
    try {
        const timestamp = Date.now();
        const sanitizedPrompt = prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-');
        const filename = `${sanitizedPrompt}-${index}-${timestamp}.${extension}`;
        const key = `users/${userId}/ai/images/${filename}`;

        // 1. Upload the image
        const putCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: Buffer.from(imageBuffer, 'base64'),
            ContentType: 'image/png'
        });
        await s3Client.send(putCommand);

        // 2. Get a signed URL for the uploaded object
        const getCommand = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
        });
        const signedUrl = await getSignedUrl(s3Client, getCommand);

        return {
            key,
            filename,
            name:filename.substring(0,filename.lastIndexOf(".")),
            extension:"png",
            path: `/ai/${filename}`,
            timestamp,
            prompt,
            url: signedUrl
        };
    } catch (error) {
        console.error('Error uploading media:', error);
        throw new Error(`Failed to upload media: ${error.message}`);
    }
}

export { uploadImage };
