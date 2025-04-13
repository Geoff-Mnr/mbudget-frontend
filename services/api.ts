import axios from "axios";

// Création de l'instance axios
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Intercepteur coté client
if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

// Fonction pour se connecter
export const login = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });
  const token = response.data.token;
  localStorage.setItem("token", token);
  return response.data;
};

// Fonction pour se déconnecter
export const logout = async () => {
  localStorage.removeItem("token");
};

// Fonction pour créer un compte
export const register = async (username: string, email: string, password: string, confirmPassword: string) => {
  try {
    const response = await api.post("/register", { username, email, password, confirm_password: confirmPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};
