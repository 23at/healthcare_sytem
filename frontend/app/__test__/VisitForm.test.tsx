import { render, screen, within, fireEvent } from "@testing-library/react";
import VisitForm, { Visit } from "@/components/VisitForm";

const patients = [
  { id: 1, firstName: "John", lastName: "Doe" },
  { id: 2, firstName: "Jane", lastName: "Smith" },
];

const visits: Visit[] = [
  { id: 1, patientId: 1, visitDate: "2025-09-25", reason: "Checkup" },
];

const onAdd = jest.fn();
const onUpdate = jest.fn();
const onDelete = jest.fn();

describe("VisitForm", () => {
  beforeEach(() => {
    render(
      <VisitForm
        patients={patients}
        visits={visits}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    );
  });

  it("renders patients in the select dropdown", () => {
    const select = screen.getByLabelText(/Patient/i);
    const options = within(select).getAllByRole("option");
    expect(options[1]).toHaveTextContent("John Doe");
    expect(options[2]).toHaveTextContent("Jane Smith");
  });

  it("renders visits in the visit list", () => {
    const visitList = screen.getByRole("list");

    // Use `getAllByRole` to find the list items
    const visitItems = within(visitList).getAllByRole("listitem");

    expect(
      visitItems.some((li) =>
        li.textContent?.includes("John Doe – 2025-09-25 – Checkup")
      )
    ).toBe(true);
  });

  it("calls onAdd when submitting a new visit", () => {
    const select = screen.getByLabelText(/Patient/i);
    const dateInput = screen.getByLabelText(/Visit Date/i);
    const reasonInput = screen.getByLabelText(/Reason \/ Diagnosis/i);
    const submitButton = screen.getByRole("button", { name: /Add Visit/i });

    // Fill form
    fireEvent.change(select, { target: { value: "2" } });
    fireEvent.change(dateInput, { target: { value: "2025-10-01" } });
    fireEvent.change(reasonInput, { target: { value: "Flu" } });

    fireEvent.click(submitButton);

    expect(onAdd).toHaveBeenCalledWith({
      patientId: 2,
      visitDate: "2025-10-01",
      reason: "Flu",
    });
  });

  it("calls onDelete when clicking Delete and confirming", () => {
    window.confirm = jest.fn(() => true); // auto-confirm

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("allows editing a visit", () => {
    const editButton = screen.getByRole("button", { name: /Edit/i });
    fireEvent.click(editButton);

    const submitButton = screen.getByRole("button", { name: /Update Visit/i });
    fireEvent.click(submitButton);

    expect(onUpdate).toHaveBeenCalledWith(1, {
      patientId: 1,
      visitDate: "2025-09-25",
      reason: "Checkup",
    });
  });
});
