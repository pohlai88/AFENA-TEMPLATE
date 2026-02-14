"use client";

// Detail page for UAE VAT Account
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useUaeVatAccount, useUpdateUaeVatAccount } from "../hooks/uae-vat-account.hooks.js";
import { UaeVatAccountForm } from "../forms/uae-vat-account-form.js";
import type { UaeVatAccount } from "../types/uae-vat-account.js";
import { Button } from "@/components/ui/button";

export function UaeVatAccountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useUaeVatAccount(params.id);
  const updateMutation = useUpdateUaeVatAccount();

  const handleSubmit = (formData: Partial<UaeVatAccount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/uae-vat-account") },
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
      <Button variant="ghost" onClick={() => router.push("/uae-vat-account")}>← Back</Button>
      <UaeVatAccountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}