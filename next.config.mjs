const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
    assetPrefix: isProd ? '/dashboard/' : '',
    basePath: isProd ? '/dashboard' : '',
    output: 'export',
};

export default nextConfig;
