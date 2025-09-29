import api from "@/api/api";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import LoginPage from "../login/page";

jest.mock("@/api/api");

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", async () => {
    // Simulate a delayed response to keep loading state active
    (api.get as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 100))
    );

    await act(async () => {
      render(<LoginPage />);
    });

    // Assert loading state is visible before session resolves
    expect(screen.getByText(/checking session/i)).toBeInTheDocument();
  });

  it("renders login form if no active session", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });

    await act(async () => {
      render(<LoginPage />);
    });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /login/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("logs in successfully", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });
    (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    await act(async () => {
      render(<LoginPage />);
    });

    const usernameInput = await screen.findByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/login", {
        username: "testuser",
        password: "password",
      });
    });
  });

  it("shows error message on failed login", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });
    (api.post as jest.Mock).mockRejectedValueOnce(new Error("Invalid creds"));

    await act(async () => {
      render(<LoginPage />);
    });

    const usernameInput = await screen.findByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "wronguser" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Invalid creds")).toBeInTheDocument();
    });
  });
});
