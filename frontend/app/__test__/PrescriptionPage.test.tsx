// app/__test__/PrescriptionsPage.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PrescriptionsPage from "@/app/prescriptions/page";
import userEvent from "@testing-library/user-event";
import api from "@/api/api";

// Mock API
jest.mock("@/api/api");
const mockedApi = api as jest.Mocked<typeof api>;

const visits = [
  { id: 1, patientId: 1, visitDate: "2025-09-25", reason: "Checkup" },
  { id: 2, patientId: 2, visitDate: "2025-09-26", reason: "Follow-up" },
];

const prescriptions = [
  {
    id: 1,
    patientId: 1,
    visitId: 1,
    medicationName: "Med A",
    dosage: "10mg",
    startDate: "2025-09-25",
    endDate: "2025-10-01",
  },
];

describe("PrescriptionsPage", () => {
  beforeAll(() => {
    window.alert = jest.fn();
    window.confirm = jest.fn(() => true);
  });

  beforeEach(() => {
    mockedApi.get.mockImplementation((url) => {
      if (url === "/visits") {
        return Promise.resolve({ data: { visits } });
      }
      if (url === "/prescriptions") {
        return Promise.resolve({ data: { prescriptions } });
      }
      return Promise.resolve({ data: {} });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders prescriptions list from API", async () => {
    render(<PrescriptionsPage />);
    await waitFor(() => {
      expect(screen.getByText(/Medication: Med A/i)).toBeInTheDocument();
      expect(screen.getByText(/Dosage: 10mg/i)).toBeInTheDocument();
    });
  });

  it("calls api.post when adding a new prescription", async () => {
    // Mock API responses
    mockedApi.get.mockImplementation((url) => {
      if (url === "/visits") return Promise.resolve({ data: { visits } });
      if (url === "/prescriptions")
        return Promise.resolve({ data: { prescriptions: [] } });
      return Promise.resolve({ data: {} });
    });
    mockedApi.post.mockResolvedValueOnce({});

    render(<PrescriptionsPage />);

    const user = userEvent.setup();

    // Wait for the select options to appear
    const visitSelect = await screen.findByLabelText(/Visit/i);

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /2025-09-26/i })
      ).toBeInTheDocument();
    });

    // Select visit id=2
    await user.selectOptions(visitSelect, "2");

    await user.type(screen.getByLabelText(/Medication Name/i), "New Med");
    await user.type(screen.getByLabelText(/Dosage/i), "20mg");
    await user.type(screen.getByLabelText(/Start Date/i), "2025-09-26");
    await user.type(screen.getByLabelText(/End Date/i), "2025-10-02");

    await user.click(screen.getByRole("button", { name: /Add Prescription/i }));

    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith("/add_prescription", {
        patientId: 2,
        visitId: 2,
        medicationName: "New Med",
        dosage: "20mg",
        startDate: "2025-09-26",
        endDate: "2025-10-02",
        id: undefined,
      });
      expect(window.alert).toHaveBeenCalledWith(
        "Prescription added successfully"
      );
    });
  });

  it("calls api.patch when editing a prescription", async () => {
    mockedApi.patch.mockResolvedValueOnce({});
    render(<PrescriptionsPage />);
    const user = userEvent.setup();

    // Wait for list
    await screen.findByText(/Medication: Med A/i);

    // Click Edit
    fireEvent.click(screen.getByText("Edit"));

    // Change values
    await user.clear(screen.getByPlaceholderText("e.g., Paracetamol"));
    await user.type(
      screen.getByPlaceholderText("e.g., Paracetamol"),
      "Updated Med"
    );

    await user.click(
      screen.getByRole("button", { name: /Update Prescription/i })
    );

    await waitFor(() => {
      expect(mockedApi.patch).toHaveBeenCalledWith("/update_prescription/1", {
        patientId: 1,
        visitId: 1,
        medicationName: "Updated Med",
        dosage: "10mg",
        startDate: "2025-09-25",
        endDate: "2025-10-01",
        id: 1,
      });
    });
  });

  it("calls api.delete when deleting a prescription", async () => {
    mockedApi.delete.mockResolvedValueOnce({});
    render(<PrescriptionsPage />);

    await screen.findByText(/Medication: Med A/i);

    // Mock confirm dialog
    window.confirm = jest.fn(() => true);

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(mockedApi.delete).toHaveBeenCalledWith("/delete_prescription/1");
    });
  });
});
