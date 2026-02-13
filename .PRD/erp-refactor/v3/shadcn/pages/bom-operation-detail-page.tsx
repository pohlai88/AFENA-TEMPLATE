"use client";

// Detail page for BOM Operation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBomOperation, useUpdateBomOperation } from "../hooks/bom-operation.hooks.js";
import { BomOperationForm } from "../forms/bom-operation-form.js";
import type { BomOperation } from "../types/bom-operation.js";
import { Button } from "@/components/ui/button";

export function BomOperationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBomOperation(params.id);
  const updateMutation = useUpdateBomOperation();

  const handleSubmit = (formData: Partial<BomOperation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bom-operation") },
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
      <Button variant="ghost" onClick={() => router.push("/bom-operation")}>← Back</Button>
      <BomOperationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}