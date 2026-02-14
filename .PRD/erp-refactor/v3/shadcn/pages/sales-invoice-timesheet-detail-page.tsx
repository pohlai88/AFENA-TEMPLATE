"use client";

// Detail page for Sales Invoice Timesheet
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesInvoiceTimesheet, useUpdateSalesInvoiceTimesheet } from "../hooks/sales-invoice-timesheet.hooks.js";
import { SalesInvoiceTimesheetForm } from "../forms/sales-invoice-timesheet-form.js";
import type { SalesInvoiceTimesheet } from "../types/sales-invoice-timesheet.js";
import { Button } from "@/components/ui/button";

export function SalesInvoiceTimesheetDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesInvoiceTimesheet(params.id);
  const updateMutation = useUpdateSalesInvoiceTimesheet();

  const handleSubmit = (formData: Partial<SalesInvoiceTimesheet>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-invoice-timesheet") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-invoice-timesheet")}>← Back</Button>
      <SalesInvoiceTimesheetForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}