"use client";

// Detail page for Warehouse Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useWarehouseType, useUpdateWarehouseType } from "../hooks/warehouse-type.hooks.js";
import { WarehouseTypeForm } from "../forms/warehouse-type-form.js";
import type { WarehouseType } from "../types/warehouse-type.js";
import { Button } from "@/components/ui/button";

export function WarehouseTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useWarehouseType(params.id);
  const updateMutation = useUpdateWarehouseType();

  const handleSubmit = (formData: Partial<WarehouseType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/warehouse-type") },
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
      <Button variant="ghost" onClick={() => router.push("/warehouse-type")}>← Back</Button>
      <WarehouseTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}