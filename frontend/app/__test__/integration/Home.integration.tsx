// Home.integration.tsx
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

jest.mock("@/hooks/useAuth");
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("Home Page (Backend Integration)", () => {
  beforeAll(async () => {
    // Log in to Flask backend to get a session cookie
    await axios.post(
      "http://localhost:8080/login",
      {
        username: "admin",
        password: "adminpass",
      },
      { withCredentials: true }
    );
  });

  beforeEach(() => {
    // Mock useAuth to return a logged-in admin
    (useAuth as jest.Mock).mockReturnValue({ role: "admin" });
  });

  it("fetches and renders dashboard counts from backend", async () => {
    render(<Home />);

    // Wait until backend data is loaded and rendered
    await waitFor(() => {
      expect(screen.getByText(/Total Patients/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Visits/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Prescriptions/i)).toBeInTheDocument();
    });
  });
});
