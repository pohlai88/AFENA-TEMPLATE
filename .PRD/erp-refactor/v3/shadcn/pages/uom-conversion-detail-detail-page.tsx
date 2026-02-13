"use client";

// Detail page for UOM Conversion Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useUomConversionDetail, useUpdateUomConversionDetail } from "../hooks/uom-conversion-detail.hooks.js";
import { UomConversionDetailForm } from "../forms/uom-conversion-detail-form.js";
import type { UomConversionDetail } from "../types/uom-conversion-detail.js";
import { Button } from "@/components/ui/button";

export function UomConversionDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useUomConversionDetail(params.id);
  const updateMutation = useUpdateUomConversionDetail();

  const handleSubmit = (formData: Partial<UomConversionDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/uom-conversion-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/uom-conversion-detail")}>← Back</Button>
      <UomConversionDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}