import { fileURLToPath } from 'node:url';

const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@spec-layer/format', '@spec-layer/extractor'],
  turbopack: {
    root: workspaceRoot,
  },
  // Keep YAML parsers as Node externals so dev/prod builds don't share stale vendor chunks.
  serverExternalPackages: ['yaml', 'gray-matter', 'js-yaml'],
};

export default nextConfig;
