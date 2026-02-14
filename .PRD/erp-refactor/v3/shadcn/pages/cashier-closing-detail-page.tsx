"use client";

// Detail page for Cashier Closing
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCashierClosing, useUpdateCashierClosing } from "../hooks/cashier-closing.hooks.js";
import { CashierClosingForm } from "../forms/cashier-closing-form.js";
import type { CashierClosing } from "../types/cashier-closing.js";
import { Button } from "@/components/ui/button";

export function CashierClosingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCashierClosing(params.id);
  const updateMutation = useUpdateCashierClosing();

  const handleSubmit = (formData: Partial<CashierClosing>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/cashier-closing") },
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
      <Button variant="ghost" onClick={() => router.push("/cashier-closing")}>← Back</Button>
      <CashierClosingForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}