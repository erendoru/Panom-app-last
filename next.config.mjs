/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'placehold.co'],
    },
    experimental: {
        serverComponentsExternalPackages: ['iyzipay'], // Fix for Iyzipay ENOENT resource error
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
