"use client";

// Detail page for Production Plan Material Request Warehouse
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProductionPlanMaterialRequestWarehouse, useUpdateProductionPlanMaterialRequestWarehouse } from "../hooks/production-plan-material-request-warehouse.hooks.js";
import { ProductionPlanMaterialRequestWarehouseForm } from "../forms/production-plan-material-request-warehouse-form.js";
import type { ProductionPlanMaterialRequestWarehouse } from "../types/production-plan-material-request-warehouse.js";
import { Button } from "@/components/ui/button";

export function ProductionPlanMaterialRequestWarehouseDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProductionPlanMaterialRequestWarehouse(params.id);
  const updateMutation = useUpdateProductionPlanMaterialRequestWarehouse();

  const handleSubmit = (formData: Partial<ProductionPlanMaterialRequestWarehouse>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/production-plan-material-request-warehouse") },
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
      <Button variant="ghost" onClick={() => router.push("/production-plan-material-request-warehouse")}>← Back</Button>
      <ProductionPlanMaterialRequestWarehouseForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}