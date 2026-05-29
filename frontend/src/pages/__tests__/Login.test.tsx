// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../Login";
import { useAuth } from "../../hooks/useAuth";

// Mock the useAuth hook
vi.mock("../../hooks/useAuth");

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login Page Component Tests", () => {
  const mockLogin = vi.fn();
  const mockClearError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      clearError: mockClearError,
      isLoading: false,
      error: null,
      user: null,
      token: null,
      isAuthenticated: false,
      register: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("should render email and password inputs and a submit button", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("example@domain.com")).toBeDefined();
    expect(screen.getByPlaceholderText("••••••••")).toBeDefined();
    expect(screen.getByRole("button", { name: /Masuk/i })).toBeDefined();
  });

  it("should call login and navigate on successful submit", async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("example@domain.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitButton = screen.getByRole("button", { name: /Masuk/i });

    fireEvent.change(emailInput, { target: { value: "test@domain.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@domain.com", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should display error message if error is present in state", () => {
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      clearError: mockClearError,
      isLoading: false,
      error: "Email atau password salah.",
      user: null,
      token: null,
      isAuthenticated: false,
      register: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("Email atau password salah.")).toBeDefined();
  });
});
