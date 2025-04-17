"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import api from "@/services/axiosInstance";
import { toast } from "sonner";
export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      console.log("Envoi de la requête de connexion à:", process.env.NEXT_PUBLIC_API_URL);
      const response = await api.post("/login", {
        email,
        password,
      });
      console.log("Réponse API data:", response.data);

      // Extraction basée sur le format de réponse exact reçu du backend
      const token = response.data.access_token;
      const userData = response.data.user;

      console.log("Token extrait:", token ? token.substring(0, 10) + "..." : "undefined");
      console.log("Utilisateur extrait:", userData);

      if (!token) {
        throw new Error("Impossible de récupérer le token d'authentification");
      }

      login(token, userData);
      toast("Bienvenue 🎉", {
        description: "Vous êtes connecté avec succès.",
      });
      console.log("Redirection vers le tableau de bord...");
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Erreur lors de la connexion:", err);
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la connexion.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold ">Formulaire de connexion </h1>
        <p className="text-muted-foreground text-sm text-balance">En route pour la gestion de votre budget 🚀</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="exemple@mail.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
          <Input id="password" type="password" required placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin size-4" />
              Connexion...
            </span>
          ) : (
            "Se connecter"
          )}
        </Button>
      </div>
      <div className="text-center text-sm">
        Pas de compte ?{" "}
        <a href="/auth/register" className="underline underline-offset-4">
          Créer un compte
        </a>
      </div>
    </form>
  );
}
