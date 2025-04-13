"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/dashboard");
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold ">Formulaire de connexion </h1>
        <p className="text-muted-foreground text-sm text-balance">En route pour la gestion de votre budget 🚀</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="exemple@mail.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
          <Input id="password" type="password" required placeholder="********" />
        </div>
        <Button type="submit" className="w-full" onClick={handleLogin}>
          Se connecter
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
