// __test__/useAuth.test.tsx
import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import useAuth from "@/hooks/useAuth";
import api from "@/api/api";

jest.mock("@/api/api", () => ({
  get: jest.fn(),
}));

// Create a single push mock
const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("useAuth hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets user if session exists", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: 1, username: "admin", role: "admin" } },
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current).toEqual({
        id: 1,
        username: "admin",
        role: "admin",
      });
    });

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("redirects to /login if API fails", async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login"); // now works
      expect(result.current).toBeNull();
    });
  });

  it("sets user to null if API returns no user", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current).toBeNull();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });
});
