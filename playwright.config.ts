import { defineConfig, devices } from '@playwright/test'

const PORT = 3000
const MOCK_API_PORT = 4010
const BASE_URL = `http://127.0.0.1:${PORT}`
const MOCK_API_URL = `http://127.0.0.1:${MOCK_API_PORT}/v2`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  timeout: 60_000,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: [
    {
      command: 'npx tsx tests/msw/http-server.ts',
      url: `http://127.0.0.1:${MOCK_API_PORT}/health`,
      // Always start a fresh mock so error-state toggles do not leak across runs.
      reuseExistingServer: false,
      timeout: 60_000,
      env: {
        ...process.env,
        MOCK_API_PORT: String(MOCK_API_PORT),
      },
    },
    {
      // NEXT_PUBLIC_* is inlined at build time — rebuild against the mock API.
      command: `NEXT_PUBLIC_FRANKFURTER_BASE_URL=${MOCK_API_URL} npm run build && NEXT_PUBLIC_FRANKFURTER_BASE_URL=${MOCK_API_URL} npm run start -- --port ${PORT}`,
      url: BASE_URL,
      reuseExistingServer: false,
      timeout: 300_000,
      env: {
        ...process.env,
        PORT: String(PORT),
        NEXT_PUBLIC_FRANKFURTER_BASE_URL: MOCK_API_URL,
      },
    },
  ],
})
