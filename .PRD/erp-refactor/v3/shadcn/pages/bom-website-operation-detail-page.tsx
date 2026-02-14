"use client";

// Detail page for BOM Website Operation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBomWebsiteOperation, useUpdateBomWebsiteOperation } from "../hooks/bom-website-operation.hooks.js";
import { BomWebsiteOperationForm } from "../forms/bom-website-operation-form.js";
import type { BomWebsiteOperation } from "../types/bom-website-operation.js";
import { Button } from "@/components/ui/button";

export function BomWebsiteOperationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBomWebsiteOperation(params.id);
  const updateMutation = useUpdateBomWebsiteOperation();

  const handleSubmit = (formData: Partial<BomWebsiteOperation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bom-website-operation") },
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
      <Button variant="ghost" onClick={() => router.push("/bom-website-operation")}>← Back</Button>
      <BomWebsiteOperationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}