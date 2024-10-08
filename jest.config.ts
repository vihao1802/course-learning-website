/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";
import dotenv from "dotenv";

// Load environment variables only if not in CI
if (process.env.CI !== "true") {
  dotenv.config({ path: "./.env.local" });
}

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  setupFiles: ["./jest.setup.ts"],
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
  testEnvironment: "jsdom",
};

export default createJestConfig(config);
