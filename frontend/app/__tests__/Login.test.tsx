import api from "@/api/api";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "../login/page";

jest.mock("@/api/api");

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    (api.get as jest.Mock).mockResolvedValue({ data: {} });
    render(<LoginPage />);
    const loadingText = screen.getByText("Checking session...");
    expect(loadingText).toBeInTheDocument();
  });
  it("renders login form if no active session", async () => {
    // Mock API call to return no active session
    (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });

    render(<LoginPage />);

    // Wait for async effects to finish (session check)
    await waitFor(() => {
      // Ensure the heading "Login" is rendered
      expect(
        screen.getByRole("heading", { name: /login/i })
      ).toBeInTheDocument();
    });

    // Ensure username and password inputs exist
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();

    // Ensure login button exists
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
  it("logs in successfully", async () => {
    // Mock no active session
    (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });
    // Mock login API
    (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    render(<LoginPage />);

    // Wait for the username input to appear (wait for useEffect to finish)
    const usernameInput = await screen.findByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    // Now fire events safely
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(loginButton);

    // Wait for the login API to be called
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/login", {
        username: "testuser",
        password: "password",
      });
    });
  });

  it("shows error message on failed login", async () => {
    // Mock no active session
    (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });
    // Mock failed login API
    (api.post as jest.Mock).mockRejectedValueOnce(new Error("Invalid creds"));
    render(<LoginPage />);
    const usernameInput = await screen.findByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(loginButton);
    await waitFor(() => {
      expect(screen.getByText("Invalid creds")).toBeInTheDocument();
    });
  });
});
