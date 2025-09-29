// app/__test__/PrescriptionForm.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import PrescriptionForm, {
  PrescriptionProps,
  VisitProps,
} from "@/components/PrescriptionForm";

describe("PrescriptionForm", () => {
  const visits: VisitProps[] = [
    { id: 1, patientId: 1, visitDate: "2025-09-25", reason: "Checkup" },
    { id: 2, patientId: 2, visitDate: "2025-09-26", reason: "Follow-up" },
  ];

  const initialData: PrescriptionProps = {
    id: 1,
    patientId: 1,
    visitId: 1,
    medicationName: "Med A",
    dosage: "10mg",
    startDate: "2025-09-25",
    endDate: "2025-10-01",
  };

  it("renders form with initial data", () => {
    render(
      <PrescriptionForm
        visits={visits}
        onSubmit={jest.fn()}
        initialData={initialData}
      />
    );

    // Input values
    expect(screen.getByDisplayValue("Med A")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10mg")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-09-25")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-10-01")).toBeInTheDocument();

    // Check selected visit using the select element
    const select = screen.getByLabelText(/Visit/i) as HTMLSelectElement;
    expect(select.value).toBe("1"); // the value of the selected option
  });
  it("calls onSubmit with new data when adding a prescription", () => {
    const onSubmit = jest.fn();
    render(<PrescriptionForm visits={visits} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText("e.g., Paracetamol"), {
      target: { value: "New Med" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g., 500mg"), {
      target: { value: "20mg" },
    });
    fireEvent.change(screen.getByLabelText(/Start Date/i), {
      target: { value: "2025-09-26" },
    });
    fireEvent.change(screen.getByLabelText(/End Date/i), {
      target: { value: "2025-10-02" },
    });
    fireEvent.change(screen.getByLabelText(/Visit/i), {
      target: { value: "2" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Add Prescription/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      patientId: 2,
      visitId: 2,
      medicationName: "New Med",
      dosage: "20mg",
      startDate: "2025-09-26",
      endDate: "2025-10-02",
      id: undefined,
    });
  });

  it("calls onSubmit with updated data when editing", () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    render(
      <PrescriptionForm
        visits={visits}
        onSubmit={onSubmit}
        initialData={initialData}
        onCancel={onCancel}
      />
    );

    fireEvent.change(screen.getByDisplayValue("Med A"), {
      target: { value: "Updated Med" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Update Prescription/i })
    );

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        medicationName: "Updated Med",
        dosage: "10mg",
        startDate: "2025-09-25",
        endDate: "2025-10-01",
        visitId: 1,
        id: 1,
      })
    );
  });

  it("calls onCancel when cancel button is clicked", () => {
    const onCancel = jest.fn();
    render(
      <PrescriptionForm
        visits={visits}
        onSubmit={jest.fn()}
        initialData={initialData}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});
