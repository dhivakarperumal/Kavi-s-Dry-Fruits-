import axios from "axios";

const isLocalHost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);
const API_URL = (
  isLocalHost
    ? import.meta.env.VITE_LOCAL_API_URL || "https://kavisdryfruits.com/api"
    : import.meta.env.VITE_API_URL || "https://kavisdryfruits.com/api"
).replace(/\/+$/, "");
export const SOCKET_URL = (
  isLocalHost
    ? import.meta.env.VITE_LOCAL_SOCKET_URL || "https://kavisdryfruits.com"
    : import.meta.env.VITE_SOCKET_URL || API_URL.replace(/\/api$/, "")
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof localStorage !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isNetworkIssue = !status && !!error?.message && /network|timeout|connection|failed/i.test(error.message);

    if (isNetworkIssue) {
      console.warn(`[API] Backend unavailable at ${API_URL}. Start the backend server or set VITE_API_URL to a working API url.`);
    } else if (status) {
      console.error(`[API] Request failed with status ${status}:`, error.message);
    }

    return Promise.reject(error);
  }
);

export default api; 