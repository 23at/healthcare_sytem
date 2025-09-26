// app/__test__/VisitPage.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VisitsPage from "@/app/visits/page";
import userEvent from "@testing-library/user-event";
import api from "@/api/api";

// Mock API
jest.mock("@/api/api");
const mockedApi = api as jest.Mocked<typeof api>;

const patients = [
  { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com" },
  { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
];

const visits = [
  { id: 1, patientId: 1, visitDate: "2025-09-25", reason: "Checkup" },
];

describe("VisitsPage", () => {
  beforeAll(() => {
    window.alert = jest.fn();
    window.confirm = jest.fn(() => true);
  });

  beforeEach(() => {
    mockedApi.get.mockImplementation((url) => {
      if (url === "/patients") return Promise.resolve({ data: { patients } });
      if (url === "/visits") return Promise.resolve({ data: { visits } });
      return Promise.resolve({ data: {} });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders visits list from API", async () => {
    render(<VisitsPage />);
    const matches = await screen.findAllByText(/John Doe/i);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Visits/i })
      ).toBeInTheDocument();
      expect(matches.length).toBeGreaterThan(0);
      expect(screen.getByText(/Checkup/)).toBeInTheDocument();
    });
  });

  it("calls api.post when adding a new visit", async () => {
    mockedApi.get.mockImplementation((url) => {
      if (url === "/patients") return Promise.resolve({ data: { patients } });
      if (url === "/visits") return Promise.resolve({ data: { visits: [] } });
      return Promise.resolve({ data: {} });
    });
    mockedApi.post.mockResolvedValueOnce({});

    render(<VisitsPage />);
    const user = userEvent.setup();

    // Wait for patient select
    const patientSelect = await screen.findByLabelText(/Patient/i);

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: (text) => text.includes("Jane") && text.includes("Smith"),
        })
      ).toBeInTheDocument();
    });

    // Then select the patient
    await user.selectOptions(patientSelect, "2");
    await user.type(screen.getByLabelText(/Visit Date/i), "2025-09-26");
    await user.type(screen.getByLabelText(/Reason/i), "Follow-up");

    await user.click(screen.getByRole("button", { name: /Add Visit/i }));

    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith(
        "/add_visit",
        { patientId: 2, visitDate: "2025-09-26", reason: "Follow-up" },
        { withCredentials: true }
      );
      expect(window.alert).toHaveBeenCalledWith("Visit added successfully");
    });
  });

  it("calls api.patch when editing a visit", async () => {
    mockedApi.patch.mockResolvedValueOnce({});
    render(<VisitsPage />);
    const user = userEvent.setup();

    // Wait for list
    await screen.findByText(/Checkup/i);

    // Click Edit
    fireEvent.click(screen.getByText("Edit"));

    // Change reason
    await user.clear(screen.getByLabelText(/Reason/i));
    await user.type(screen.getByLabelText(/Reason/i), "Updated Checkup");

    await user.click(screen.getByRole("button", { name: /Update Visit/i }));

    await waitFor(() => {
      expect(mockedApi.patch).toHaveBeenCalledWith(
        "/update_visit/1",
        {
          patientId: 1,
          visitDate: "2025-09-25",
          reason: "Updated Checkup",
        },
        { withCredentials: true }
      );
      expect(window.alert).toHaveBeenCalledWith("Visit updated successfully");
    });
  });

  it("calls api.delete when deleting a visit", async () => {
    mockedApi.delete.mockResolvedValueOnce({});
    render(<VisitsPage />);

    await screen.findByText(/Checkup/i);

    // Mock confirm dialog
    window.confirm = jest.fn(() => true);

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(mockedApi.delete).toHaveBeenCalledWith("/delete_visit/1", {
        withCredentials: true,
      });
      expect(window.alert).toHaveBeenCalledWith("Visit deleted successfully");
    });
  });
});
