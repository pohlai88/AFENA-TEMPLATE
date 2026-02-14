"use client";

// Detail page for Sales Partner
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesPartner, useUpdateSalesPartner } from "../hooks/sales-partner.hooks.js";
import { SalesPartnerForm } from "../forms/sales-partner-form.js";
import type { SalesPartner } from "../types/sales-partner.js";
import { Button } from "@/components/ui/button";

export function SalesPartnerDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesPartner(params.id);
  const updateMutation = useUpdateSalesPartner();

  const handleSubmit = (formData: Partial<SalesPartner>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-partner") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-partner")}>← Back</Button>
      <SalesPartnerForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}