"use client";

// Detail page for Warehouse
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useWarehouse, useUpdateWarehouse } from "../hooks/warehouse.hooks.js";
import { WarehouseForm } from "../forms/warehouse-form.js";
import type { Warehouse } from "../types/warehouse.js";
import { Button } from "@/components/ui/button";

export function WarehouseDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useWarehouse(params.id);
  const updateMutation = useUpdateWarehouse();

  const handleSubmit = (formData: Partial<Warehouse>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/warehouse") },
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
      <Button variant="ghost" onClick={() => router.push("/warehouse")}>← Back</Button>
      <WarehouseForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}