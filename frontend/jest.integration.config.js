/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./", // Path to your Next.js app
});

const customJestConfig = {
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/integration/**/*.integration.[jt]s?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // adjust if your code is in src/
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // mock styles
  },
  collectCoverageFrom: [
    "components/**/*.{js,jsx,ts,tsx}",
    "app/**/*.{js,jsx,ts,tsx}",
    "pages/**/*.{js,jsx,ts,tsx}",
  ],
};

module.exports = createJestConfig(customJestConfig);
