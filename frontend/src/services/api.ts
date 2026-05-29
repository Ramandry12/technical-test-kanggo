import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout(true);
      useToastStore
        .getState()
        .addToast("error", "Sesi Anda telah berakhir. Silakan login kembali.");
    }
    return Promise.reject(error);
  },
);

export default api;
