"use client";

// Detail page for Accounts Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAccountsSettings, useUpdateAccountsSettings } from "../hooks/accounts-settings.hooks.js";
import { AccountsSettingsForm } from "../forms/accounts-settings-form.js";
import type { AccountsSettings } from "../types/accounts-settings.js";
import { Button } from "@/components/ui/button";

export function AccountsSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAccountsSettings(params.id);
  const updateMutation = useUpdateAccountsSettings();

  const handleSubmit = (formData: Partial<AccountsSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/accounts-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/accounts-settings")}>← Back</Button>
      <AccountsSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}