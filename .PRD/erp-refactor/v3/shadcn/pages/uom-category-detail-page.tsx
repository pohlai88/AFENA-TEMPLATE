"use client";

// Detail page for UOM Category
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useUomCategory, useUpdateUomCategory } from "../hooks/uom-category.hooks.js";
import { UomCategoryForm } from "../forms/uom-category-form.js";
import type { UomCategory } from "../types/uom-category.js";
import { Button } from "@/components/ui/button";

export function UomCategoryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useUomCategory(params.id);
  const updateMutation = useUpdateUomCategory();

  const handleSubmit = (formData: Partial<UomCategory>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/uom-category") },
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
      <Button variant="ghost" onClick={() => router.push("/uom-category")}>← Back</Button>
      <UomCategoryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}