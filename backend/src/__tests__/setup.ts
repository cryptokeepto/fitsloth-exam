/**
 * Jest Test Setup
 * Global setup and teardown for all tests
 */

// Extend Jest matchers
// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.PORT = '3001';

// Global test timeout
jest.setTimeout(10000);

// Clean up after all tests
afterAll(async () => {
  // Add cleanup logic if needed
});
