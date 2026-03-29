/**
 * Lighthouse CI Configuration
 * Day 28-29: Performance Optimization
 */

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready on',
      url: [
        'http://localhost:3000',
        'http://localhost:3000/athletes',
        'http://localhost:3000/calendar',
        'http://localhost:3000/data-os',
        'http://localhost:3000/forms',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        // Performance
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'interactive': ['error', { maxNumericValue: 3500 }],

        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.9 }],

        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.9 }],

        // SEO
        'categories:seo': ['warn', { minScore: 0.9 }],

        // PWA (optional)
        'categories:pwa': ['warn', { minScore: 0.5 }],

        // Performance Score
        'categories:performance': ['error', { minScore: 0.85 }],

        // Specific Audits
        'uses-responsive-images': 'error',
        'offscreen-images': 'warn',
        'unminified-css': 'error',
        'unminified-javascript': 'error',
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',
        'modern-image-formats': 'warn',
        'uses-optimized-images': 'warn',
        'uses-text-compression': 'error',
        'uses-long-cache-ttl': 'warn',
        'efficient-animated-content': 'warn',
        'duplicated-javascript': 'warn',
        'legacy-javascript': 'warn',
        'bootup-time': ['warn', { maxNumericValue: 3500 }],
        'mainthread-work-breakdown': ['warn', { maxNumericValue: 4000 }],
        'dom-size': ['warn', { maxNumericValue: 1500 }],
        'font-display': 'warn',
        'third-party-summary': 'warn',
        'third-party-facades': 'warn',
        'largest-contentful-paint-element': 'off',
        'layout-shift-elements': 'off',
        'long-tasks': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
