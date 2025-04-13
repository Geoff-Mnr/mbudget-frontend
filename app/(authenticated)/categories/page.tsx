"use client";

import { DataTable } from "@/components/data-table";

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Catégories</h1>
      <DataTable data={[]} />
    </div>
  );
}
