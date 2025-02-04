/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['mediamatrix-vm.s3.eu-north-1.amazonaws.com',
                  'd1chbixg7zxkhs.cloudfront.net'],
    },
    reactStrictMode:false
};

export default nextConfig;
