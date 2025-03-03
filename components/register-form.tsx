import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold ">Formulaire d&apos;inscription </h1>
        <p className="text-muted-foreground text-sm text-balance">
          En route pour la gestion de votre budget 🚀
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Nom d&apos;utilisateur</Label>
          <Input id="username" type="text" placeholder="John Doe" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="exemple@mail.com"
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            placeholder="********"
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="confirm_password">Confirmer le mot de passe</Label>
          </div>
          <Input
            id="confirm_password"
            type="password"
            required
            placeholder="********"
          />
        </div>
        <Button type="submit" className="w-full">
          Créer un compte
        </Button>
      </div>
      <div className="text-center text-sm">
        Déjà un compte ?{" "}
        <a href="/auth/login" className="underline underline-offset-4">
          Se connecter
        </a>
      </div>
    </form>
  );
}
