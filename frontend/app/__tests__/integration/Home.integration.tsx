import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import useAuth from "@/hooks/useAuth";
import api from "@/api/api";

jest.mock("@/hooks/useAuth");
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock the api module
jest.mock("@/api/api");

describe("Home Page (Mocked API Integration)", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ role: "admin" });

    // Provide fake backend response
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        totalPatients: 10,
        totalVisits: 5,
        totalPrescriptions: 3,
      },
    });
  });

  it("fetches and renders dashboard counts from mocked backend", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Total Patients/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Visits/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Prescriptions/i)).toBeInTheDocument();
    });
  });
});
