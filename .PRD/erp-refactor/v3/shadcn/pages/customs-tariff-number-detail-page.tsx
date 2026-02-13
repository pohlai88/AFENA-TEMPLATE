"use client";

// Detail page for Customs Tariff Number
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCustomsTariffNumber, useUpdateCustomsTariffNumber } from "../hooks/customs-tariff-number.hooks.js";
import { CustomsTariffNumberForm } from "../forms/customs-tariff-number-form.js";
import type { CustomsTariffNumber } from "../types/customs-tariff-number.js";
import { Button } from "@/components/ui/button";

export function CustomsTariffNumberDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCustomsTariffNumber(params.id);
  const updateMutation = useUpdateCustomsTariffNumber();

  const handleSubmit = (formData: Partial<CustomsTariffNumber>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/customs-tariff-number") },
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
      <Button variant="ghost" onClick={() => router.push("/customs-tariff-number")}>← Back</Button>
      <CustomsTariffNumberForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}