import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "bun1yv",
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    defaultCommandTimeout: 10000, // optional: wait longer for elements
    pageLoadTimeout: 20000,
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
