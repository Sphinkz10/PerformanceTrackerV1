/**
 * Calendar V4 - Jest Configuration
 * Configuração específica para testes do Calendar
 * 
 * @version 4.0.0
 * @created 2026-01-11
 * @phase 6.3
 */

module.exports = {
  // ============================================
  // ENVIRONMENT
  // ============================================
  
  testEnvironment: 'jsdom',
  
  // ============================================
  // SETUP FILES
  // ============================================
  
  setupFilesAfterEnv: [
    '<rootDir>/components/calendar/__tests__/setup.ts'
  ],
  
  // ============================================
  // MODULE PATHS
  // ============================================
  
  moduleNameMapper: {
    // Handle CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  
  // ============================================
  // TRANSFORM
  // ============================================
  
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // ============================================
  // TEST PATTERNS
  // ============================================
  
  testMatch: [
    '<rootDir>/components/calendar/__tests__/**/*.test.{ts,tsx}',
    '<rootDir>/components/calendar/__tests__/**/*.e2e.test.{ts,tsx}',
  ],
  
  // ============================================
  // COVERAGE
  // ============================================
  
  collectCoverageFrom: [
    'components/calendar/**/*.{ts,tsx}',
    '!components/calendar/**/*.d.ts',
    '!components/calendar/**/*.stories.{ts,tsx}',
    '!components/calendar/__tests__/**',
    '!components/calendar/**/index.{ts,tsx}',
  ],
  
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
  ],
  
  // ============================================
  // PERFORMANCE
  // ============================================
  
  maxWorkers: '50%',
  
  // ============================================
  // MISC
  // ============================================
  
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Automatically reset mock state between tests
  resetMocks: true,
  
  // ============================================
  // GLOBALS
  // ============================================
  
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  
  // ============================================
  // MODULE FILE EXTENSIONS
  // ============================================
  
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
  ],
  
  // ============================================
  // TEST TIMEOUT
  // ============================================
  
  testTimeout: 10000,
};
