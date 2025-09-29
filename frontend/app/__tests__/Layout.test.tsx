import { render } from "@testing-library/react";
import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  it("renders children and applies font classes", () => {
    render(<RootLayout>Test Child</RootLayout>);
    const body = document.body;

    // Check for class names
    expect(body.className).toContain("variable"); // matches both fonts in Jest
    expect(body.className).toContain("antialiased");

    // Check children rendered
    expect(body.textContent).toContain("Test Child");
  });
});
