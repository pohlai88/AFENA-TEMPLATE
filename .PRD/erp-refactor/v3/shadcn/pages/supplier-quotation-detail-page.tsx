"use client";

// Detail page for Supplier Quotation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupplierQuotation, useUpdateSupplierQuotation } from "../hooks/supplier-quotation.hooks.js";
import { SupplierQuotationForm } from "../forms/supplier-quotation-form.js";
import type { SupplierQuotation } from "../types/supplier-quotation.js";
import { Button } from "@/components/ui/button";

export function SupplierQuotationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupplierQuotation(params.id);
  const updateMutation = useUpdateSupplierQuotation();

  const handleSubmit = (formData: Partial<SupplierQuotation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/supplier-quotation") },
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
      <Button variant="ghost" onClick={() => router.push("/supplier-quotation")}>← Back</Button>
      <SupplierQuotationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}