import { create } from "zustand";
import api from "../services/api";
import { useToastStore } from "./toastStore";
import axios from "axios";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "pending" | "in-progress" | "done";
  deadline: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

interface TaskFilters {
  status: string; // 'all' | 'pending' | 'in-progress' | 'done'
  search: string;
  page: number;
  limit: number;
}

interface TaskState {
  tasks: Task[];
  meta: PaginationMeta | null;
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (
    title: string,
    description: string | null,
    status: string,
    deadline: string | null,
  ) => Promise<void>;
  updateTask: (
    id: number,
    data: {
      title?: string;
      description?: string | null;
      status?: string;
      deadline?: string | null;
    },
  ) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setFilters: (newFilters: Partial<TaskFilters>) => void;
  resetFilters: () => void;
}

const initialFilters: TaskFilters = {
  status: "all",
  search: "",
  page: 1,
  limit: 3,
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  meta: null,
  filters: initialFilters,
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { status, search, page, limit } = get().filters;

      const params: {
        page: number;
        limit: number;
        status?: string;
        search?: string;
      } = { page, limit };
      if (status && status !== "all") {
        params.status = status;
      }
      if (search && search.trim() !== "") {
        params.search = search.trim();
      }

      const response = await api.get("/tasks", { params });
      set({
        tasks: response.data.data,
        meta: response.data.meta,
        isLoading: false,
      });
    } catch (error) {
      const axiosError = axios.isAxiosError(error) ? error : null;
      const errMsg =
        axiosError?.response?.data?.message || "Gagal memuat daftar tugas.";
      set({ isLoading: false, error: errMsg });
      useToastStore.getState().addToast("error", errMsg);
    }
  },

  createTask: async (title, description, status, deadline) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/tasks", { title, description, status, deadline });
      set({ isLoading: false });
      useToastStore
        .getState()
        .addToast("success", "Tugas berhasil ditambahkan!");
      await get().fetchTasks();
    } catch (error) {
      const axiosError = axios.isAxiosError(error) ? error : null;
      const errMsg =
        axiosError?.response?.data?.message || "Gagal menambahkan tugas.";
      set({ isLoading: false });
      useToastStore.getState().addToast("error", errMsg);
      throw error;
    }
  },

  updateTask: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/tasks/${id}`, data);
      set({ isLoading: false });
      useToastStore
        .getState()
        .addToast("success", "Tugas berhasil diperbarui!");
      await get().fetchTasks();
    } catch (error) {
      const axiosError = axios.isAxiosError(error) ? error : null;
      const errMsg =
        axiosError?.response?.data?.message || "Gagal memperbarui tugas.";
      set({ isLoading: false });
      useToastStore.getState().addToast("error", errMsg);
      throw error;
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/tasks/${id}`);
      set({ isLoading: false });
      useToastStore.getState().addToast("success", "Tugas berhasil dihapus!");

      const { tasks, filters } = get();
      if (tasks.length === 1 && filters.page > 1) {
        set((state) => ({
          filters: { ...state.filters, page: state.filters.page - 1 },
        }));
      }

      await get().fetchTasks();
    } catch (error) {
      const axiosError = axios.isAxiosError(error) ? error : null;
      const errMsg =
        axiosError?.response?.data?.message || "Gagal menghapus tugas.";
      set({ isLoading: false });
      useToastStore.getState().addToast("error", errMsg);
      throw error;
    }
  },

  setFilters: (newFilters) => {
    set((state) => {
      const page =
        newFilters.status || newFilters.search !== undefined
          ? 1
          : newFilters.page || state.filters.page;
      return {
        filters: {
          ...state.filters,
          ...newFilters,
          page,
        },
      };
    });
    get().fetchTasks();
  },

  resetFilters: () => {
    set({ filters: initialFilters });
    get().fetchTasks();
  },
}));
