import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'e2e/**'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        '.next/**',
        'e2e/**',
        'tests/**',
        'src/components/ui/**',
        '**/*.module.scss',
        '**/*.d.ts',
        'src/app/layout.tsx',
        'src/app/globals.css',
        'src/styles/**',
        '**/*.types.ts',
        'vitest.config.ts',
        'playwright.config.ts',
        'next.config.ts',
        'prettier.config.mts',
        'eslint.config.mts',
        'postcss.config.mjs',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
