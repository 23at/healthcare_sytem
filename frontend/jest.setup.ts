import "@testing-library/jest-dom";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}
global.IS_REACT_ACT_ENVIRONMENT = true;
// jest.setup.ts
// const originalError = console.error;
// console.error = (...args) => {
//   if (
//     typeof args[0] === "string" &&
//     args[0].includes("React.act is not a function")
//   ) {
//     return; // ignore this specific warning
//   }
//   originalError(...args);
// };

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));
