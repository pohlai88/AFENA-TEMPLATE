"use client";

// Detail page for Supplier Group Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupplierGroupItem, useUpdateSupplierGroupItem } from "../hooks/supplier-group-item.hooks.js";
import { SupplierGroupItemForm } from "../forms/supplier-group-item-form.js";
import type { SupplierGroupItem } from "../types/supplier-group-item.js";
import { Button } from "@/components/ui/button";

export function SupplierGroupItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupplierGroupItem(params.id);
  const updateMutation = useUpdateSupplierGroupItem();

  const handleSubmit = (formData: Partial<SupplierGroupItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/supplier-group-item") },
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
      <Button variant="ghost" onClick={() => router.push("/supplier-group-item")}>← Back</Button>
      <SupplierGroupItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}