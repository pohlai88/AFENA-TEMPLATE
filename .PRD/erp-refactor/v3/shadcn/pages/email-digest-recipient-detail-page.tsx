"use client";

// Detail page for Email Digest Recipient
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useEmailDigestRecipient, useUpdateEmailDigestRecipient } from "../hooks/email-digest-recipient.hooks.js";
import { EmailDigestRecipientForm } from "../forms/email-digest-recipient-form.js";
import type { EmailDigestRecipient } from "../types/email-digest-recipient.js";
import { Button } from "@/components/ui/button";

export function EmailDigestRecipientDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useEmailDigestRecipient(params.id);
  const updateMutation = useUpdateEmailDigestRecipient();

  const handleSubmit = (formData: Partial<EmailDigestRecipient>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/email-digest-recipient") },
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
      <Button variant="ghost" onClick={() => router.push("/email-digest-recipient")}>← Back</Button>
      <EmailDigestRecipientForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}