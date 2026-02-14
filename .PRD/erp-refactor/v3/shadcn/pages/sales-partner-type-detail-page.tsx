"use client";

// Detail page for Sales Partner Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesPartnerType, useUpdateSalesPartnerType } from "../hooks/sales-partner-type.hooks.js";
import { SalesPartnerTypeForm } from "../forms/sales-partner-type-form.js";
import type { SalesPartnerType } from "../types/sales-partner-type.js";
import { Button } from "@/components/ui/button";

export function SalesPartnerTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesPartnerType(params.id);
  const updateMutation = useUpdateSalesPartnerType();

  const handleSubmit = (formData: Partial<SalesPartnerType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-partner-type") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-partner-type")}>← Back</Button>
      <SalesPartnerTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}