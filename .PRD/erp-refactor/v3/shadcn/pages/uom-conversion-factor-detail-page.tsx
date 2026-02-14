"use client";

// Detail page for UOM Conversion Factor
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useUomConversionFactor, useUpdateUomConversionFactor } from "../hooks/uom-conversion-factor.hooks.js";
import { UomConversionFactorForm } from "../forms/uom-conversion-factor-form.js";
import type { UomConversionFactor } from "../types/uom-conversion-factor.js";
import { Button } from "@/components/ui/button";

export function UomConversionFactorDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useUomConversionFactor(params.id);
  const updateMutation = useUpdateUomConversionFactor();

  const handleSubmit = (formData: Partial<UomConversionFactor>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/uom-conversion-factor") },
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
      <Button variant="ghost" onClick={() => router.push("/uom-conversion-factor")}>← Back</Button>
      <UomConversionFactorForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}