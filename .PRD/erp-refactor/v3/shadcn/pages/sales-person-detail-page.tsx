"use client";

// Detail page for Sales Person
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesPerson, useUpdateSalesPerson } from "../hooks/sales-person.hooks.js";
import { SalesPersonForm } from "../forms/sales-person-form.js";
import type { SalesPerson } from "../types/sales-person.js";
import { Button } from "@/components/ui/button";

export function SalesPersonDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesPerson(params.id);
  const updateMutation = useUpdateSalesPerson();

  const handleSubmit = (formData: Partial<SalesPerson>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-person") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-person")}>← Back</Button>
      <SalesPersonForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}