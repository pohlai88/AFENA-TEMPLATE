"use client";

// Detail page for Supplier Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupplierItem, useUpdateSupplierItem } from "../hooks/supplier-item.hooks.js";
import { SupplierItemForm } from "../forms/supplier-item-form.js";
import type { SupplierItem } from "../types/supplier-item.js";
import { Button } from "@/components/ui/button";

export function SupplierItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupplierItem(params.id);
  const updateMutation = useUpdateSupplierItem();

  const handleSubmit = (formData: Partial<SupplierItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/supplier-item") },
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
      <Button variant="ghost" onClick={() => router.push("/supplier-item")}>← Back</Button>
      <SupplierItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}