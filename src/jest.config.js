/**
 * Jest Configuration - Complete Test Suite
 * 
 * Day 23-24: Unit & Integration Testing
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // Module paths
  moduleDirectories: ['node_modules', '<rootDir>'],
  
  // Path mapping (matching tsconfig.json)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/styles/(.*)$': '<rootDir>/styles/$1',
    
    // Handle CSS imports (CSS modules)
    '\\.module\\.(css|scss)$': 'identity-obj-proxy',
    
    // Handle CSS imports (global)
    '\\.(css|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
    
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/tests/__mocks__/fileMock.js',
  },

  // Transform files
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
    '^.+\\.(js|jsx)$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'ecmascript',
          jsx: true,
        },
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },

  // Test match patterns
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.(ts|tsx)',
    '<rootDir>/tests/integration/**/*.test.(tsx)',
    '<rootDir>/__tests__/**/*.(test|spec).(ts|tsx)',
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
    '/build/',
    '/coverage/',
    '/tests/visual/',
    '/tests/e2e/',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/__tests__/**',
    '!**/tests/**',
    '!components/ui/**', // Exclude shadcn components
    '!components/figma/**', // Exclude Figma generated
  ],

  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 80,
      statements: 80,
    },
    // Specific thresholds for critical modules
    './hooks/**/*.{ts,tsx}': {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    './lib/**/*.{ts,tsx}': {
      branches: 75,
      functions: 75,
      lines: 80,
      statements: 80,
    },
  },

  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
  ],

  // Globals
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
      },
    },
  },

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Max workers
  maxWorkers: '50%',

  // Cache directory
  cacheDirectory: '<rootDir>/.jest-cache',

  // Error on deprecated
  errorOnDeprecated: true,

  // Notify
  notify: false,
  notifyMode: 'failure-change',

  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],

  // Projects for different test types (optional, for future use)
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.test.(ts|tsx)'],
      testEnvironment: 'jsdom',
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.test.(tsx)'],
      testEnvironment: 'jsdom',
    },
  ],
};
