"use client";

// Detail page for Import Supplier Invoice
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useImportSupplierInvoice, useUpdateImportSupplierInvoice } from "../hooks/import-supplier-invoice.hooks.js";
import { ImportSupplierInvoiceForm } from "../forms/import-supplier-invoice-form.js";
import type { ImportSupplierInvoice } from "../types/import-supplier-invoice.js";
import { Button } from "@/components/ui/button";

export function ImportSupplierInvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useImportSupplierInvoice(params.id);
  const updateMutation = useUpdateImportSupplierInvoice();

  const handleSubmit = (formData: Partial<ImportSupplierInvoice>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/import-supplier-invoice") },
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
      <Button variant="ghost" onClick={() => router.push("/import-supplier-invoice")}>← Back</Button>
      <ImportSupplierInvoiceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}