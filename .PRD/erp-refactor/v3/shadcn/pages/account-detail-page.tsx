"use client";

// Detail page for Account
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAccount, useUpdateAccount } from "../hooks/account.hooks.js";
import { AccountForm } from "../forms/account-form.js";
import type { Account } from "../types/account.js";
import { Button } from "@/components/ui/button";

export function AccountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAccount(params.id);
  const updateMutation = useUpdateAccount();

  const handleSubmit = (formData: Partial<Account>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/account") },
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
      <Button variant="ghost" onClick={() => router.push("/account")}>← Back</Button>
      <AccountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}