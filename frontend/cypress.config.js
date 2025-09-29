const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.ts", // keeps your TS test files
    supportFile: false,
    baseUrl: "http://localhost:3000", // points to frontend container
  },
});
