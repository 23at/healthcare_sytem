// import api from "@/api/api";
// import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import LoginPage from "../login/page";

// jest.mock("@/api/api");

// describe("LoginPage", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it("shows loading state initially", async () => {
//     // Simulate a delayed response to keep loading state active
//     (api.get as jest.Mock).mockImplementation(
//       () =>
//         new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 100))
//     );

//     render(<LoginPage />);

//     // Assert loading state is visible before session resolves
//     expect(screen.getByText(/checking session/i)).toBeInTheDocument();
//   });

//   it("renders login form if no active session", async () => {
//     (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });

//     render(<LoginPage />);

//     await waitFor(() => {
//       expect(
//         screen.getByRole("heading", { name: /login/i })
//       ).toBeInTheDocument();
//     });

//     expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
//     expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
//     expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
//   });

//   it("logs in successfully", async () => {
//     (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });
//     (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

//     render(<LoginPage />);

//     const usernameInput = await screen.findByPlaceholderText(/username/i);
//     const passwordInput = screen.getByPlaceholderText(/password/i);
//     const loginButton = screen.getByRole("button", { name: /login/i });

//     fireEvent.change(usernameInput, { target: { value: "testuser" } });
//     fireEvent.change(passwordInput, { target: { value: "password" } });
//     fireEvent.click(loginButton);

//     await waitFor(() => {
//       expect(api.post).toHaveBeenCalledWith("/login", {
//         username: "testuser",
//         password: "password",
//       });
//     });
//   });

//   it("shows error message on failed login", async () => {
//     (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });
//     (api.post as jest.Mock).mockRejectedValueOnce(new Error("Invalid creds"));

//     render(<LoginPage />);

//     const usernameInput = await screen.findByPlaceholderText(/username/i);
//     const passwordInput = screen.getByPlaceholderText(/password/i);
//     const loginButton = screen.getByRole("button", { name: /login/i });

//     fireEvent.change(usernameInput, { target: { value: "wronguser" } });
//     fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
//     fireEvent.click(loginButton);

//     await waitFor(() => {
//       expect(screen.getByText("Invalid creds")).toBeInTheDocument();
//     });
//   });
// });
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../login/page";
import api from "@/api/api";
import { useRouter } from "next/navigation";

jest.mock("@/api/api");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginPage", () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
  });

  it("shows loading state initially", () => {
    (api.get as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<LoginPage />);

    expect(screen.getByText("Checking session...")).toBeInTheDocument();
  });

  it("renders login form if no active session", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.queryByText("Checking session...")).not.toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("logs in successfully", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });
    (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Username"), "testuser");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/login", {
        username: "testuser",
        password: "password123",
      });
    });

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("shows error message on failed login", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });
    (api.post as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid credentials")
    );

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Username"), "wronguser");
    await user.type(screen.getByPlaceholderText("Password"), "wrongpass");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("redirects to home if user already has active session", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: 1, username: "testuser" } },
    });

    render(<LoginPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });

    // Should not render login form
    expect(screen.queryByPlaceholderText("Username")).not.toBeInTheDocument();
  });
});
