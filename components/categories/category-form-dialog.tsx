"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Resolver, SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createCategory, updateCategory } from "@/services/categoryService";
import { IconPlus } from "@tabler/icons-react";
import { Category } from "./data-table";

// Schéma de validation pour le formulaire
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  household_id: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormDialogProps {
  category?: Category; // Optionnel pour l'édition
  mode: "create" | "edit";
  onSuccess?: () => void; // Callback après succès pour rafraîchir les données
  triggerButton?: boolean; // Afficher ou non le bouton déclencheur
  defaultOpen?: boolean; // Si le dialogue doit être ouvert par défaut
}

export function CategoryFormDialog({ category, mode, onSuccess, triggerButton = true, defaultOpen = false }: CategoryFormDialogProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Effet pour gérer le callback après la fermeture du dialogue
  useEffect(() => {
    // Si le dialogue vient de se fermer et que l'opération a été effectuée
    if (!open && isCompleted) {
      // Réinitialiser l'état de complétion
      setIsCompleted(false);
      // Exécuter le callback après un court délai
      const timeoutId = setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [open, isCompleted, onSuccess]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      is_active: category?.is_active ?? true,
      household_id: category?.household?.id,
    },
  });

  // Réinitialiser le formulaire quand la catégorie change
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name || "",
        description: category.description || "",
        is_active: category.is_active ?? true,
        household_id: category.household?.id,
      });
    }
  }, [category, form]);

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (open && mode === "edit" && category) {
      form.reset({
        name: category.name || "",
        description: category.description || "",
        is_active: category.is_active ?? true,
        household_id: category.household?.id,
      });
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        description: "",
        is_active: true,
        household_id: undefined,
      });
    }
  }, [open, category, form, mode]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      let response;

      if (mode === "create") {
        response = await createCategory(data);
        if (response && response.success) {
          toast.success("Catégorie créée avec succès");
          setIsCompleted(true);
          form.reset(); // Réinitialiser le formulaire après succès

          // Appeler directement le callback si disponible
          if (onSuccess) {
            onSuccess();
          }

          // Fermer la boîte de dialogue après le callback
          setOpen(false);
        } else {
          console.error("Erreur lors de la création de la catégorie:", response);
          toast.error(response?.message || "Erreur lors de la création de la catégorie");
          setIsCompleted(false);
        }
      } else if (mode === "edit" && category) {
        // S'assurer que l'ID est correctement passé et converti en nombre si nécessaire
        const categoryId = typeof category.id === "string" ? parseInt(category.id, 10) : category.id;

        response = await updateCategory(categoryId, data);
        if (response && response.success) {
          toast.success("Catégorie mise à jour avec succès");
          setIsCompleted(true);

          // Appeler directement le callback si disponible
          if (onSuccess) {
            onSuccess();
          }

          // Fermer la boîte de dialogue après le callback
          setOpen(false);
        } else {
          console.error("Erreur lors de la mise à jour de la catégorie:", response);
          toast.error(response?.message || "Erreur lors de la mise à jour de la catégorie");
          setIsCompleted(false);
        }
      }
    } catch (error: unknown) {
      console.error("Erreur lors de l'enregistrement de la catégorie:", error);
      setIsCompleted(false);

      // Typeguard pour vérifier si l'erreur a une propriété response
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message);
        } else {
          toast.error("Erreur lors de l'enregistrement de la catégorie");
        }
      } else {
        toast.error("Erreur lors de l'enregistrement de la catégorie");
      }
    } finally {
      setLoading(false);
    }
  };

  const title = mode === "create" ? "Ajouter une catégorie" : "Modifier la catégorie";
  const description = mode === "create" ? "Créez une nouvelle catégorie pour organiser vos dépenses et revenus." : "Modifiez les informations de cette catégorie.";
  const buttonText = mode === "create" ? "Créer" : "Enregistrer";

  const dialogContent = (
    <DialogContent className="sm:max-w-[425px] z-50">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FormValues>)} className="space-y-4 py-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de la catégorie" {...field} autoFocus />
                </FormControl>
                <FormDescription>Le nom de votre catégorie (ex: Alimentation, Transport)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description de la catégorie (optionnel)" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Une description détaillée de cette catégorie (optionnel)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Actif</FormLabel>
                  <FormDescription>Définir si cette catégorie est active</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Traitement..." : buttonText}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );

  // Si nous ne voulons pas de bouton déclencheur, retourner seulement le dialogue
  if (!triggerButton) {
    return (
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          // Seulement permettre la fermeture si nous ne sommes pas en cours de chargement
          if (loading && !newOpen) return;
          setOpen(newOpen);
        }}
      >
        {dialogContent}
      </Dialog>
    );
  }

  // Retourner le dialogue avec le bouton déclencheur
  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        // Seulement permettre la fermeture si nous ne sommes pas en cours de chargement
        if (loading && !newOpen) return;
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button size="sm">
            <IconPlus className="mr-1" />
            <span className="hidden lg:inline">Ajouter une catégorie</span>
            <span className="lg:hidden">Ajouter</span>
          </Button>
        ) : (
          <Button variant="ghost" className="w-full justify-start px-2">
            Modifier
          </Button>
        )}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
