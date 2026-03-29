/**
 * Playwright E2E Configuration
 * Day 25: End-to-end testing configuration
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests/e2e',
  
  // Test match pattern
  testMatch: '**/*.spec.ts',

  // Timeout
  timeout: 60000, // 60s per test
  
  // Global timeout
  globalTimeout: 30 * 60 * 1000, // 30 minutes
  
  // Expect timeout
  expect: {
    timeout: 10000, // 10s for assertions
  },

  // Fail fast
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  
  // Retries
  retries: process.env.CI ? 2 : 0,
  
  // Workers
  workers: process.env.CI ? 2 : undefined,

  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report/e2e', open: 'never' }],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
    ['junit', { outputFile: 'test-results/e2e-junit.xml' }],
    ['list'],
  ],

  // Output directory
  outputDir: 'test-results/e2e',

  // Use options
  use: {
    // Base URL
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Trace
    trace: 'on-first-retry',
    
    // Screenshot
    screenshot: 'only-on-failure',
    
    // Video
    video: 'retain-on-failure',

    // Context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Action timeout
    actionTimeout: 15000,
    
    // Navigation timeout
    navigationTimeout: 30000,
  },

  // Web server
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },

  // Projects (browsers)
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 7'],
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 14 Pro'],
      },
    },

    // Tablet
    {
      name: 'tablet',
      use: { 
        ...devices['iPad Pro'],
      },
    },
  ],
});
