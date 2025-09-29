// app/__test__/integration/setup.ts
import "@testing-library/jest-dom"; // adds matchers like toBeInTheDocument

// Optional: global mocks for next/router
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Optional: increase default timeout for async tests
jest.setTimeout(15000);
