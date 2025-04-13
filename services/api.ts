import axios from "axios";

// Création de l'instance axios
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
console.log("Configuration de l'API avec URL:", apiUrl);

export const api = axios.create({
  baseURL: apiUrl,
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
  try {
    const response = await api.post("/login", { email, password });

    // Extraction du token basée sur le format exact renvoyé par le backend
    const token = response.data.access_token;

    if (!token) {
      console.error("Aucun access_token trouvé dans la réponse API");
      throw new Error("Aucun token d'authentification n'a été reçu");
    }

    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la connexion (API service):", error);
    throw error;
  }
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
