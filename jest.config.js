// jest.config.js
export default {
    testEnvironment: 'node', // Ideal for backend testing
    testMatch: ['**/tests/**/*.test.js'], // Look for test files in /tests
    transform: {}, // Disable Babel unless needed
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'], // Optional: custom setup
    moduleFileExtensions: ['js', 'json'],
    clearMocks: true, // Automatically clear mocks before each test
  };
  