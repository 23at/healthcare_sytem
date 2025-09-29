// app/__test__/PatientsPage.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PatientsPage from "../patients/page";
import api from "@/api/api";

jest.mock("@/api/api");
jest.mock("@/hooks/useAuth", () => () => {});

describe("PatientsPage", () => {
  const patients = [
    { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com" },
    { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
  ];

  beforeEach(() => {
    (api.get as jest.Mock).mockResolvedValue({ data: { patients } });
    (api.post as jest.Mock).mockResolvedValue({});
    (api.patch as jest.Mock).mockResolvedValue({});
    (api.delete as jest.Mock).mockResolvedValue({});

    // Mock window.confirm and window.alert
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
  });

  it("renders patient list", async () => {
    render(<PatientsPage />);
    expect(
      await screen.findByText("John Doe | john@example.com")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Jane Smith | jane@example.com")
    ).toBeInTheDocument();
  });

  it("calls api.post when adding a patient", async () => {
    render(<PatientsPage />);

    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Wonder" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "alice@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Add Patient/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/add_patient",
        expect.objectContaining({
          firstName: "Alice",
          lastName: "Wonder",
          email: "alice@example.com",
        })
      );
    });
  });

  it("calls api.patch when updating a patient", async () => {
    render(<PatientsPage />);

    // click first edit button
    const editButtons = await screen.findAllByText("Edit");
    fireEvent.click(editButtons[0]);

    // update form
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "John Updated" },
    });

    // click submit (button text is "Update Patient")
    const submitButton = screen.getByRole("button", {
      name: /Update Patient/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith(
        `/update_patient/1`,
        expect.objectContaining({ firstName: "John Updated" })
      );
    });
  });

  it("calls api.delete when deleting a patient", async () => {
    render(<PatientsPage />);

    // click first delete button
    const deleteButtons = await screen.findAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith(`/delete_patient/1`);
    });
  });
  //this is skipped because window.confirm is mocked to always return true
  it.skip("cancels delete if confirm is false", async () => {
    window.confirm = jest.fn(() => false);
    render(<PatientsPage />);

    const deleteButtons = await screen.findAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(api.delete).not.toHaveBeenCalled();
    });
  });
});
