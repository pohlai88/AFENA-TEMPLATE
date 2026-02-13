"use client";

// Detail page for Pegged Currency Details
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePeggedCurrencyDetails, useUpdatePeggedCurrencyDetails } from "../hooks/pegged-currency-details.hooks.js";
import { PeggedCurrencyDetailsForm } from "../forms/pegged-currency-details-form.js";
import type { PeggedCurrencyDetails } from "../types/pegged-currency-details.js";
import { Button } from "@/components/ui/button";

export function PeggedCurrencyDetailsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePeggedCurrencyDetails(params.id);
  const updateMutation = useUpdatePeggedCurrencyDetails();

  const handleSubmit = (formData: Partial<PeggedCurrencyDetails>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pegged-currency-details") },
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
      <Button variant="ghost" onClick={() => router.push("/pegged-currency-details")}>← Back</Button>
      <PeggedCurrencyDetailsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}