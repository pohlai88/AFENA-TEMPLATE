"use client";

// Detail page for South Africa VAT Account
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSouthAfricaVatAccount, useUpdateSouthAfricaVatAccount } from "../hooks/south-africa-vat-account.hooks.js";
import { SouthAfricaVatAccountForm } from "../forms/south-africa-vat-account-form.js";
import type { SouthAfricaVatAccount } from "../types/south-africa-vat-account.js";
import { Button } from "@/components/ui/button";

export function SouthAfricaVatAccountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSouthAfricaVatAccount(params.id);
  const updateMutation = useUpdateSouthAfricaVatAccount();

  const handleSubmit = (formData: Partial<SouthAfricaVatAccount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/south-africa-vat-account") },
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
      <Button variant="ghost" onClick={() => router.push("/south-africa-vat-account")}>← Back</Button>
      <SouthAfricaVatAccountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}