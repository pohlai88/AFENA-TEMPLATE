"use client";

// Detail page for Journal Entry Template Account
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useJournalEntryTemplateAccount, useUpdateJournalEntryTemplateAccount } from "../hooks/journal-entry-template-account.hooks.js";
import { JournalEntryTemplateAccountForm } from "../forms/journal-entry-template-account-form.js";
import type { JournalEntryTemplateAccount } from "../types/journal-entry-template-account.js";
import { Button } from "@/components/ui/button";

export function JournalEntryTemplateAccountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useJournalEntryTemplateAccount(params.id);
  const updateMutation = useUpdateJournalEntryTemplateAccount();

  const handleSubmit = (formData: Partial<JournalEntryTemplateAccount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/journal-entry-template-account") },
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
      <Button variant="ghost" onClick={() => router.push("/journal-entry-template-account")}>← Back</Button>
      <JournalEntryTemplateAccountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}