/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
        remotePatterns: [
            { hostname: "cdn.pixabay.com" }
        ]
    },
    reactStrictMode: true,
    transpilePackages: ['@mui/material', '@mui/icons-material', '@mui/system'],
};

export default nextConfig;
