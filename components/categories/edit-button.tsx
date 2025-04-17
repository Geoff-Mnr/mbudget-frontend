"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Category } from "./data-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Resolver, SubmitHandler } from "react-hook-form";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { updateCategory } from "@/services/categoryService";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

// Schéma de validation pour le formulaire
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  household_id: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditButtonProps {
  category: Category;
  onSuccess?: () => void;
}

export function EditButton({ category, onSuccess }: EditButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  // Effet pour gérer le callback après la fermeture du dialogue
  useEffect(() => {
    // Si le dialogue vient de se fermer et que la mise à jour a été effectuée
    if (!open && isUpdated) {
      // Réinitialiser l'état de mise à jour
      setIsUpdated(false);
      // Exécuter le callback après un court délai
      const timeoutId = setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [open, isUpdated, onSuccess]);

  // Valeurs par défaut en fonction du mode (création ou édition)
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
    if (open) {
      form.reset({
        name: category.name || "",
        description: category.description || "",
        is_active: category.is_active ?? true,
        household_id: category.household?.id,
      });
    }
  }, [open, category, form]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      // S'assurer que l'ID est correctement passé et converti en nombre si nécessaire
      const categoryId = typeof category.id === "string" ? parseInt(category.id, 10) : category.id;

      const response = await updateCategory(categoryId, data);

      if (response && response.success) {
        toast.success("Catégorie mise à jour avec succès");
        setIsUpdated(true);

        // Appeler directement le callback si disponible
        if (onSuccess) {
          onSuccess();
        }

        // Fermer la boîte de dialogue après le callback
        setOpen(false);
      } else {
        console.error("Erreur lors de l'enregistrement de la catégorie:", response);
        toast.error(response?.message || "Erreur lors de l'enregistrement de la catégorie");
        setIsUpdated(false);
      }
    } catch (error: unknown) {
      console.error("Erreur lors de l'enregistrement de la catégorie:", error);
      setIsUpdated(false);

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

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Modifier
      </DropdownMenuItem>

      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          // Seulement permettre la fermeture si nous ne sommes pas en cours de chargement
          if (loading && !newOpen) return;
          setOpen(newOpen);
        }}
      >
        <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>Modifiez les informations de cette catégorie.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FormValues>)} className="space-y-4 py-2" onClick={(e) => e.stopPropagation()}>
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
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Traitement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
