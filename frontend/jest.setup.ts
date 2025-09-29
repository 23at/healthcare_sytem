import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Suppress act warnings in CI
const originalError = console.error;
console.error = (...args) => {
  if (args[0].includes("React.act is not a function")) {
    return;
  }
  originalError(...args);
};
