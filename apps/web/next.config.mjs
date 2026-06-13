/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@spec-layer/format', '@spec-layer/extractor'],
  // Keep YAML parsers as Node externals so dev/prod builds don't share stale vendor chunks.
  experimental: {
    serverComponentsExternalPackages: ['yaml', 'gray-matter', 'js-yaml'],
  },
};

export default nextConfig;
