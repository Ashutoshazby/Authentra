import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const normalizedApiUrl = rawApiUrl.replace(/\/+$/, "");
const authBaseUrl = normalizedApiUrl.replace(/\/api$/, "");

const api = axios.create({
  baseURL: normalizedApiUrl,
  timeout: 120000
});

const authApi = axios.create({
  baseURL: authBaseUrl,
  timeout: 120000
});

async function postAuth(path, payload) {
  const attempts = [`/auth${path}`, `/api/auth${path}`];
  let lastError = null;

  for (const url of attempts) {
    try {
      const response = await authApi.post(url, payload);
      return response.data;
    } catch (error) {
      lastError = error;

      const status = error?.response?.status;
      if (status && status !== 404) {
        throw error;
      }
    }
  }

  throw lastError;
}

async function getAuth(path, headers = {}) {
  const attempts = [`/auth${path}`, `/api/auth${path}`];
  let lastError = null;

  for (const url of attempts) {
    try {
      const response = await authApi.get(url, { headers });
      return response.data;
    } catch (error) {
      lastError = error;

      const status = error?.response?.status;
      if (status && status !== 404) {
        throw error;
      }
    }
  }

  throw lastError;
}

export async function signupUser(payload) {
  return postAuth("/signup", payload);
}

export async function loginUser(payload) {
  return postAuth("/login", payload);
}

export async function loginWithGoogle(credential) {
  return postAuth("/google", { credential });
}

export async function fetchCurrentUser() {
  return getAuth("/me", {
    Authorization: api.defaults.headers.common.Authorization
  });
}

export async function analyzeText(text) {
  const response = await api.post("/analyze", { text });
  return response.data;
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
}

export async function unlockScan(userId) {
  const payload = userId ? { userId } : {};
  const response = await api.post("/unlock-scan", payload);
  return response.data;
}

export default api;
