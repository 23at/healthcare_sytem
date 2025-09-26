import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import axios from "axios";

// Optional: set baseURL for your real backend in Docker
axios.defaults.baseURL = "http://localhost:8080"; // your running Flask app

describe("Home Page Integration Test", () => {
  it("fetches and renders dashboard counts from the real backend", async () => {
    render(<Home />);

    // Should show loading initially
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    // Wait for dashboard counts to appear
    await waitFor(() => {
      expect(screen.getByText(/Total Patients/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Visits/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Prescriptions/i)).toBeInTheDocument();
    });

    // Check that counts are numbers from the backend
    const patientsCount = screen.getByText(/\d+/); // first number found
    expect(Number(patientsCount.textContent)).toBeGreaterThanOrEqual(0);
  });
});
