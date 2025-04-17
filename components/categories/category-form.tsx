"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Resolver, SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createCategory, updateCategory } from "@/services/categoryService";
import { IconArrowLeft } from "@tabler/icons-react";
import { Category } from "./data-table";

// Schéma de validation pour le formulaire
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  household_id: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  category?: Category; // Optionnel pour l'édition
  mode: "create" | "edit";
  onSuccess?: () => void; // Callback après succès pour rafraîchir les données
  onCancel: () => void; // Pour revenir à la liste
}

export function CategoryForm({ category, mode, onSuccess, onCancel }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);

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
    } else {
      form.reset({
        name: "",
        description: "",
        is_active: true,
        household_id: undefined,
      });
    }
  }, [category, form, mode]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      let response;

      if (mode === "create") {
        response = await createCategory(data);
        if (response && response.success) {
          toast.success("Catégorie créée avec succès");
          form.reset(); // Réinitialiser le formulaire après succès

          // Appeler directement le callback si disponible
          if (onSuccess) {
            onSuccess();
          }
        } else {
          console.error("Erreur lors de la création de la catégorie:", response);
          toast.error(response?.message || "Erreur lors de la création de la catégorie");
        }
      } else if (mode === "edit" && category) {
        // S'assurer que l'ID est correctement passé et converti en nombre si nécessaire
        const categoryId = typeof category.id === "string" ? parseInt(category.id, 10) : category.id;

        response = await updateCategory(categoryId, data);
        if (response && response.success) {
          toast.success("Catégorie mise à jour avec succès");

          // Appeler directement le callback si disponible
          if (onSuccess) {
            onSuccess();
          }
        } else {
          console.error("Erreur lors de la mise à jour de la catégorie:", response);
          toast.error(response?.message || "Erreur lors de la mise à jour de la catégorie");
        }
      }
    } catch (error: unknown) {
      console.error("Erreur lors de l'enregistrement de la catégorie:", error);

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
  const buttonText = mode === "create" ? "Créer" : "Enregistrer";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="mr-2">
          <IconArrowLeft className="mr-1" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FormValues>)} className="space-y-4">
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
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Traitement..." : buttonText}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
