"use client";

// Detail page for Share Balance
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useShareBalance, useUpdateShareBalance } from "../hooks/share-balance.hooks.js";
import { ShareBalanceForm } from "../forms/share-balance-form.js";
import type { ShareBalance } from "../types/share-balance.js";
import { Button } from "@/components/ui/button";

export function ShareBalanceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useShareBalance(params.id);
  const updateMutation = useUpdateShareBalance();

  const handleSubmit = (formData: Partial<ShareBalance>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/share-balance") },
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
      <Button variant="ghost" onClick={() => router.push("/share-balance")}>← Back</Button>
      <ShareBalanceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}