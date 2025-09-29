// __tests__/PatientDetailPage.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import PatientDetailPage from "@/app/patients/[id]/page";
import api from "@/api/api";
import { useParams, useRouter } from "next/navigation";

// Mock next/navigation useParams
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(), // add this
}));

// Mock api
jest.mock("@/api/api", () => ({
  get: jest.fn(),
}));

describe("PatientDetailPage", () => {
  const mockPatientResponse = {
    patient: {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    },
    visits: [
      { id: 1, patientId: 1, visitDate: "2025-09-20", reason: "Checkup" },
    ],
    prescriptions: [
      {
        id: 1,
        patientId: 1,
        medicationName: "Aspirin",
        dosage: "100mg",
        startDate: "2025-09-01",
        endDate: null,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() }); // ✅ add this
  });

  it("renders loading state initially", () => {
    (api.get as jest.Mock).mockReturnValue(new Promise(() => {})); // never resolves
    render(<PatientDetailPage />);
    expect(screen.getByText(/Loading patient details/i)).toBeInTheDocument();
  });

  it("renders error state if api call fails", async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error("Network Error"));

    render(<PatientDetailPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Failed to load patient details/i)
      ).toBeInTheDocument()
    );
  });

  it("renders patient details on success", async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockPatientResponse });

    render(<PatientDetailPage />);

    // Wait for patient data to load
    expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/)).toBeInTheDocument();

    // Visits
    expect(screen.getByText(/2025-09-20 – Checkup/)).toBeInTheDocument();

    // Prescriptions
    expect(
      screen.getByText(/Aspirin \(100mg\) – 2025-09-01/)
    ).toBeInTheDocument();
  });

  it("shows fallback message if no data returned", async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: null });

    render(<PatientDetailPage />);

    expect(await screen.findByText(/No patient found/i)).toBeInTheDocument();
  });
});
