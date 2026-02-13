"use client";

// Detail page for Request for Quotation Supplier
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useRequestForQuotationSupplier, useUpdateRequestForQuotationSupplier } from "../hooks/request-for-quotation-supplier.hooks.js";
import { RequestForQuotationSupplierForm } from "../forms/request-for-quotation-supplier-form.js";
import type { RequestForQuotationSupplier } from "../types/request-for-quotation-supplier.js";
import { Button } from "@/components/ui/button";

export function RequestForQuotationSupplierDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useRequestForQuotationSupplier(params.id);
  const updateMutation = useUpdateRequestForQuotationSupplier();

  const handleSubmit = (formData: Partial<RequestForQuotationSupplier>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/request-for-quotation-supplier") },
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
      <Button variant="ghost" onClick={() => router.push("/request-for-quotation-supplier")}>← Back</Button>
      <RequestForQuotationSupplierForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}