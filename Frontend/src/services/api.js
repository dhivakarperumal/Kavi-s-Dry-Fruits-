import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "https://kavis.qtechx.com/api").replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
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