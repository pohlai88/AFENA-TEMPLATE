"use client";

// Detail page for Party Account
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePartyAccount, useUpdatePartyAccount } from "../hooks/party-account.hooks.js";
import { PartyAccountForm } from "../forms/party-account-form.js";
import type { PartyAccount } from "../types/party-account.js";
import { Button } from "@/components/ui/button";

export function PartyAccountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePartyAccount(params.id);
  const updateMutation = useUpdatePartyAccount();

  const handleSubmit = (formData: Partial<PartyAccount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/party-account") },
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
      <Button variant="ghost" onClick={() => router.push("/party-account")}>← Back</Button>
      <PartyAccountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}