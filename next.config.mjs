import withBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzerConfigured = withBundleAnalyzer({
    enabled:
        process.env.ANALYZE === 'true' && process.env.NODE_ENV === 'production',
});

/** @type {import('next').NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                hostname: 'cdn.sanity.io',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        return config;
    },
};

export default withBundleAnalyzerConfigured(config);
