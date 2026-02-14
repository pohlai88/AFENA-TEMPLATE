"use client";

// Detail page for Supplier
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupplier, useUpdateSupplier } from "../hooks/supplier.hooks.js";
import { SupplierForm } from "../forms/supplier-form.js";
import type { Supplier } from "../types/supplier.js";
import { Button } from "@/components/ui/button";

export function SupplierDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupplier(params.id);
  const updateMutation = useUpdateSupplier();

  const handleSubmit = (formData: Partial<Supplier>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/supplier") },
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
      <Button variant="ghost" onClick={() => router.push("/supplier")}>← Back</Button>
      <SupplierForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}