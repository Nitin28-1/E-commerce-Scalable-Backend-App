module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
testMatch: ["**/?(*.)+(spec|test).js"],
  clearMocks: true,
};