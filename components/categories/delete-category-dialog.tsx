"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { deleteCategory } from "@/services/categoryService";
import { Category } from "./data-table";

interface DeleteCategoryDialogProps {
  category: Category;
  onSuccess?: () => void; // Callback après suppression pour rafraîchir les données
}

export function DeleteCategoryDialog({ category, onSuccess }: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCategory(category.id);
      toast.success("Catégorie supprimée avec succès");
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
      toast.error("Erreur lors de la suppression de la catégorie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start px-2 text-destructive">
          Supprimer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer la catégorie</DialogTitle>
          <DialogDescription>Êtes-vous sûr de vouloir supprimer la catégorie &quot;{category.name}&quot; ? Cette action est irréversible.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
