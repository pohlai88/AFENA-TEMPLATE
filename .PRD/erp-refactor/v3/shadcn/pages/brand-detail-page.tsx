"use client";

// Detail page for Brand
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBrand, useUpdateBrand } from "../hooks/brand.hooks.js";
import { BrandForm } from "../forms/brand-form.js";
import type { Brand } from "../types/brand.js";
import { Button } from "@/components/ui/button";

export function BrandDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBrand(params.id);
  const updateMutation = useUpdateBrand();

  const handleSubmit = (formData: Partial<Brand>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/brand") },
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
      <Button variant="ghost" onClick={() => router.push("/brand")}>← Back</Button>
      <BrandForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}