// import { config } from "dotenv";
// config();
import { S3Client } from "@aws-sdk/client-s3";

const isLocal = process.env.IS_OFFLINE || process.env.NODE_ENV === 'development';

const s3ClientConfig = {
    region: process.env.AWS_REGION,
};

// Only add credentials for local development
if (isLocal) {
    s3ClientConfig.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
}

export const s3Client = new S3Client(s3ClientConfig);