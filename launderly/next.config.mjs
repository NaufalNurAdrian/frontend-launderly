/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
        remotePatterns: [
            { hostname: "cdn.pixabay.com" }
        ]
    }
};

export default nextConfig;
