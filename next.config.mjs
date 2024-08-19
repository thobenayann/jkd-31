import withBundleAnalyzer from '@next/bundle-analyzer';
import webpack from 'webpack';

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
        // Ignore toutes les locales sauf 'fr'
        config.plugins.push(
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/)
        );

        return config;
    },
};

export default withBundleAnalyzerConfigured(config);
