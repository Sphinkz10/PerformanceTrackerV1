import { defineConfig, devices } from '@playwright/test';

/**
 * VISUAL REGRESSION & VIEWPORT TESTING CONFIG
 * 
 * Day 21-22: Comprehensive visual testing across devices
 * 
 * Features:
 * - Screenshot comparison
 * - Multiple viewports (mobile, tablet, desktop)
 * - Touch target validation
 * - Orientation testing
 * - Pixel-perfect comparison
 */

export default defineConfig({
  testDir: './tests/visual',
  
  // Output folders
  outputDir: './test-results/visual',
  
  // Snapshot settings
  snapshotDir: './tests/visual/snapshots',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',
  
  // Visual comparison settings
  expect: {
    toHaveScreenshot: {
      // Maximum pixel difference threshold (0-1)
      maxDiffPixels: 100,
      // Maximum percentage difference (0-1)
      maxDiffPixelRatio: 0.01,
      // Comparison method
      threshold: 0.2,
      // Animations: wait for all to finish
      animations: 'disabled',
    },
  },

  // Timeout settings
  timeout: 30000,
  expect: {
    timeout: 10000,
  },

  // Run tests in parallel
  fullyParallel: true,
  
  // Fail build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests
  retries: process.env.CI ? 2 : 0,
  
  // Reporter config
  reporter: [
    ['html', { outputFolder: './test-results/visual-report' }],
    ['list'],
    ['json', { outputFile: './test-results/visual-results.json' }],
  ],

  // Shared settings for all projects
  use: {
    // Base URL
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Browser options
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Viewport default (overridden per project)
    viewport: { width: 1280, height: 720 },
  },

  // Configure projects for major browsers and devices
  projects: [
    // ============================================
    // DESKTOP BROWSERS
    // ============================================
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'Desktop Firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'Desktop Safari',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    
    // ============================================
    // TABLET DEVICES
    // ============================================
    {
      name: 'iPad Pro Portrait',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
      },
    },
    {
      name: 'iPad Pro Landscape',
      use: {
        ...devices['iPad Pro landscape'],
        viewport: { width: 1366, height: 1024 },
      },
    },
    {
      name: 'iPad Air',
      use: {
        ...devices['iPad (gen 7)'],
        viewport: { width: 820, height: 1180 },
      },
    },
    
    // ============================================
    // MOBILE DEVICES - PORTRAIT
    // ============================================
    {
      name: 'iPhone 14 Pro Portrait',
      use: {
        ...devices['iPhone 14 Pro'],
        viewport: { width: 393, height: 852 },
      },
    },
    {
      name: 'iPhone 13 Portrait',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'iPhone SE Portrait',
      use: {
        ...devices['iPhone SE'],
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'Pixel 7 Portrait',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 412, height: 915 },
      },
    },
    {
      name: 'Galaxy S9+ Portrait',
      use: {
        ...devices['Galaxy S9+'],
        viewport: { width: 320, height: 658 },
      },
    },
    
    // ============================================
    // MOBILE DEVICES - LANDSCAPE
    // ============================================
    {
      name: 'iPhone 14 Pro Landscape',
      use: {
        ...devices['iPhone 14 Pro landscape'],
        viewport: { width: 852, height: 393 },
      },
    },
    {
      name: 'iPhone 13 Landscape',
      use: {
        ...devices['iPhone 13 landscape'],
        viewport: { width: 844, height: 390 },
      },
    },
    {
      name: 'Pixel 7 Landscape',
      use: {
        ...devices['Pixel 7 landscape'],
        viewport: { width: 915, height: 412 },
      },
    },
    
    // ============================================
    // CUSTOM BREAKPOINTS (matching Tailwind)
    // ============================================
    {
      name: 'Tailwind SM (640px)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 640, height: 900 },
      },
    },
    {
      name: 'Tailwind MD (768px)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'Tailwind LG (1024px)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: 'Tailwind XL (1280px)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'Tailwind 2XL (1536px)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1536, height: 864 },
      },
    },
  ],

  // Run local dev server before tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
