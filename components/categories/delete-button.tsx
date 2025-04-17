"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { deleteCategory } from "@/services/categoryService";
import { Category } from "./data-table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface DeleteButtonProps {
  category: Category;
  onSuccess?: () => void;
}

export function DeleteButton({ category, onSuccess }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Effet pour gérer le callback après la fermeture du dialogue
  useEffect(() => {
    // Si le dialogue vient de se fermer et que la suppression a été effectuée
    if (!open && isDeleted) {
      // Réinitialiser l'état de suppression
      setIsDeleted(false);
      // Exécuter le callback après un court délai
      const timeoutId = setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [open, isDeleted, onSuccess]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCategory(category.id);
      toast.success("Catégorie supprimée avec succès");
      // Marquer comme supprimé mais ne pas encore fermer le dialogue
      setIsDeleted(true);
      // Fermer le dialogue
      setOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
      toast.error("Erreur lors de la suppression de la catégorie");
      setIsDeleted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenuItem
        variant="destructive"
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        className="text-destructive"
      >
        Supprimer
      </DropdownMenuItem>

      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          // Seulement permettre la fermeture si nous ne sommes pas en cours de chargement
          if (loading && !newOpen) return;
          setOpen(newOpen);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer la catégorie</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir supprimer la catégorie &quot;{category.name}&quot; ? Cette action est irréversible.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
