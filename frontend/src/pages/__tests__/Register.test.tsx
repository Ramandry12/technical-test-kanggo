// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../Register";
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

describe("Register Page Component Tests", () => {
  const mockRegister = vi.fn();
  const mockClearError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      clearError: mockClearError,
      isLoading: false,
      error: null,
      user: null,
      token: null,
      isAuthenticated: false,
      register: mockRegister,
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("should render registration fields and a submit button", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Andry Ramadhan")).toBeDefined();
    expect(screen.getByPlaceholderText("example@domain.com")).toBeDefined();
    expect(screen.getByPlaceholderText("Min. 6 karakter")).toBeDefined();
    expect(screen.getByPlaceholderText("Ulangi password")).toBeDefined();
    expect(screen.getByRole("button", { name: /Daftar/i })).toBeDefined();
  });

  it("should display a local error if passwords do not match and not trigger register", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText("Andry Ramadhan");
    const emailInput = screen.getByPlaceholderText("example@domain.com");
    const passwordInput = screen.getByPlaceholderText("Min. 6 karakter");
    const confirmInput = screen.getByPlaceholderText("Ulangi password");
    const submitButton = screen.getByRole("button", { name: /Daftar/i });

    fireEvent.change(nameInput, { target: { value: "Andry Ramadhan" } });
    fireEvent.change(emailInput, { target: { value: "andry@domain.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "different123" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("Konfirmasi password tidak cocok.")).toBeDefined();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should call register and navigate to login on successful submission", async () => {
    mockRegister.mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText("Andry Ramadhan");
    const emailInput = screen.getByPlaceholderText("example@domain.com");
    const passwordInput = screen.getByPlaceholderText("Min. 6 karakter");
    const confirmInput = screen.getByPlaceholderText("Ulangi password");
    const submitButton = screen.getByRole("button", { name: /Daftar/i });

    fireEvent.change(nameInput, { target: { value: "Andry Ramadhan" } });
    fireEvent.change(emailInput, { target: { value: "andry@domain.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith("Andry Ramadhan", "andry@domain.com", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("should display server error if register fails", () => {
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      clearError: mockClearError,
      isLoading: false,
      error: "Email sudah terdaftar.",
      user: null,
      token: null,
      isAuthenticated: false,
      register: mockRegister,
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByText("Email sudah terdaftar.")).toBeDefined();
  });
});
