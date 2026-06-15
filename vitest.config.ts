import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./apps/web/src', import.meta.url)),
    },
  },
  test: {
    include: [
      'packages/**/test/**/*.test.ts',
      'apps/**/src/**/*.test.{ts,tsx}',
    ],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'],
      include: [
        'packages/*/src/**/*.ts',
        'apps/web/src/**/*.{ts,tsx}',
      ],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/types.ts',
        'packages/*/src/index.ts',
      ],
      // A ratchet, not an aspiration: this floor only moves up. Raise it as
      // coverage improves so regressions fail CI, but never lower it.
      thresholds: {
        statements: 45,
        branches: 40,
        functions: 50,
        lines: 45,
      },
    },
  },
});
