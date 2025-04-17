import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
console.log("Configuration de l'API avec URL:", apiUrl);

const api = axios.create({
  baseURL: apiUrl,
});

// Intercepteur (client uniquement)
if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

export default api;
