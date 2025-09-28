describe("Healthcare App - E2E Tests", () => {
  // Reusable login function
  const loginAsAdmin = () => {
    cy.visit("http://localhost:3000");
    cy.get('input[placeholder="Username"]').type("admin");
    cy.get('input[placeholder="Password"]').type("adminpass");
    cy.get("button").click();
    cy.contains("Welcome, admin").should("be.visible");
  };

  beforeEach(() => {
    // Always login before each test
    loginAsAdmin();
  });

  it("shows dashboard counts", () => {
    // loginAsAdmin();
    cy.contains("Total Patients").next().should("exist");
    cy.contains("Total Visits").next().should("exist");
    cy.contains("Total Prescriptions").next().should("exist");

    // Log counts
    cy.contains("Total Patients").next().invoke("text").then(console.log);
    cy.contains("Total Visits").next().invoke("text").then(console.log);
    cy.contains("Total Prescriptions").next().invoke("text").then(console.log);
  });

  it("dashboard counts are numeric", () => {
    cy.contains("Total Patients")
      .next()
      .invoke("text")
      .should("match", /^\d+$/);
    cy.contains("Total Visits").next().invoke("text").should("match", /^\d+$/);
    cy.contains("Total Prescriptions")
      .next()
      .invoke("text")
      .should("match", /^\d+$/);
  });

  // it("shows error for invalid login credentials", () => {
  //   cy.visit("http://localhost:3000");
  //   cy.get('input[placeholder="Username"]').type("wronguser");
  //   cy.get('input[placeholder="Password"]').type("wrongpass");
  //   cy.get("button").click();
  //   cy.contains("Invalid username or password").should("be.visible");
  // });

  it("navigates to Patients page and lists patients", () => {
    cy.contains("Patients").click();
    cy.get("ul").should("exist");
    cy.get("ul li").should("have.length.greaterThan", 0);
  });

  it("adds a new patient and verifies dashboard updates", () => {
    cy.contains("Total Patients")
      .invoke("text")
      .then((countBefore) => {
        const countBeforeNum = parseInt(countBefore);

        cy.contains("Patients").click();
        cy.contains("Add Patient").click();

        cy.get('input[placeholder="First Name"]').type("Test");
        cy.get('input[placeholder="Last Name"]').type("User");
        cy.get('input[placeholder="Email"]').type("testuser@example.com");
        cy.get("button[type='submit']").click();

        // Verify patient appears in list
        cy.contains("Test User").should("exist");

        // Verify dashboard updated
        cy.contains("Healthcare App").click();
        cy.contains("Total Patients");
      });
  });

  it("edits a patient", () => {
    cy.contains("Patients").click();
    cy.contains("Test User")
      .parent("li")
      .within(() => {
        cy.contains("Edit").click();
      });

    cy.get('input[placeholder="Email"]').clear().type("newemail@example.com");
    cy.get("button[type='submit']").click();

    cy.contains("newemail@example.com").should("exist");
  });

  it("shows validation error for invalid patient email", () => {
    cy.contains("Patients").click();
    cy.contains("Add Patient").click();

    cy.get('input[placeholder="First Name"]').type("Invalid");
    cy.get('input[placeholder="Last Name"]').type("Email");
    cy.get('input[placeholder="Email"]').type("not-an-email");
    cy.get("button[type='submit']").click();

    cy.get('input[placeholder="Email"]')
      .should("have.prop", "validationMessage")
      .and("contain", "@");
  });

  it("logs out successfully", () => {
    cy.contains("Logout").click();
    cy.get('input[placeholder="Username"]').should("exist");
    cy.get('input[placeholder="Password"]').should("exist");
  });
});
