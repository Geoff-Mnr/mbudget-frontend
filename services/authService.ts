// src/services/authService.ts
import api from "./axiosInstance";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password });
    const token = response.data.access_token;

    if (!token) {
      throw new Error("Aucun token d'authentification reçu.");
    }

    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const register = async (username: string, email: string, password: string, confirmPassword: string) => {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
      confirm_password: confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
