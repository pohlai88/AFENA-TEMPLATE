"use client";

// Detail page for Item Supplier
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemSupplier, useUpdateItemSupplier } from "../hooks/item-supplier.hooks.js";
import { ItemSupplierForm } from "../forms/item-supplier-form.js";
import type { ItemSupplier } from "../types/item-supplier.js";
import { Button } from "@/components/ui/button";

export function ItemSupplierDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemSupplier(params.id);
  const updateMutation = useUpdateItemSupplier();

  const handleSubmit = (formData: Partial<ItemSupplier>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-supplier") },
    );
  };

  if (isFetching) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (!data) {
    return <p className="text-destructive">Not found</p>;
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => router.push("/item-supplier")}>← Back</Button>
      <ItemSupplierForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}