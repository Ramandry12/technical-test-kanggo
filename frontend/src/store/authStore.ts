import { create } from "zustand";
import axios from "axios";
import { useToastStore } from "./toastStore";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: (silent?: boolean) => void;
  checkAuth: () => void;
  clearError: () => void;
}

const API_URL = import.meta.env.VITE_API_URL + "/auth";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      const { user, token } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      useToastStore
        .getState()
        .addToast("success", "Login berhasil! Selamat datang kembali.");
    } catch (error) {
      const axiosError = axios.isAxiosError(error) ? error : null;
      const errMsg =
        axiosError?.response?.data?.message ||
        "Login gagal. Silakan coba lagi.";
      set({ isLoading: false, error: errMsg });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/register`, { name, email, password });
      set({ isLoading: false });
      useToastStore
        .getState()
        .addToast("success", "Registrasi berhasil! Silakan masuk.");
    } catch (error) {
      const axiosError = axios.isAxiosError(error) ? error : null;
      const errMsg =
        axiosError?.response?.data?.message ||
        "Registrasi gagal. Silakan coba lagi.";
      set({ isLoading: false, error: errMsg });
      throw error;
    }
  },

  logout: (silent = false) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });

    if (!silent) {
      useToastStore
        .getState()
        .addToast("info", "Anda telah keluar dari aplikasi.");
    }
  },

  checkAuth: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  },
}));
