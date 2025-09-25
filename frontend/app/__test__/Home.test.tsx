// Home.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import Home from "../page";
import api from "@/api/api";
import useAuth from "@/hooks/useAuth";

// Mock api + useAuth
jest.mock("@/api/api");
jest.mock("@/hooks/useAuth");

describe("Home Component", () => {
  it("renders loading state if no user", () => {
    (useAuth as jest.Mock).mockReturnValue(null);

    render(<Home />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders dashboard counts after fetching data", async () => {
    (useAuth as jest.Mock).mockReturnValue({ role: "admin" });
    (api.get as jest.Mock).mockImplementation((url) => {
      if (url === "/patients")
        return Promise.resolve({ data: { patients: [1, 2, 3] } });
      if (url === "/visits") return Promise.resolve({ data: { visits: [1] } });
      if (url === "/prescriptions")
        return Promise.resolve({ data: { prescriptions: [1, 2] } });
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Total Patients")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });
});
