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
  if (
    typeof args[0] === "string" &&
    (args[0].includes("React.act is not a function") ||
      args[0].includes("`ReactDOMTestUtils.act` is deprecated"))
  ) {
    return;
  }
  originalError(...args);
};
