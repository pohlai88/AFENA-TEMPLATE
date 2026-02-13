"use client";

// Detail page for Variant Field
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useVariantField, useUpdateVariantField } from "../hooks/variant-field.hooks.js";
import { VariantFieldForm } from "../forms/variant-field-form.js";
import type { VariantField } from "../types/variant-field.js";
import { Button } from "@/components/ui/button";

export function VariantFieldDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useVariantField(params.id);
  const updateMutation = useUpdateVariantField();

  const handleSubmit = (formData: Partial<VariantField>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/variant-field") },
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
      <Button variant="ghost" onClick={() => router.push("/variant-field")}>← Back</Button>
      <VariantFieldForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}