"use client";

// Detail page for Email Digest
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useEmailDigest, useUpdateEmailDigest } from "../hooks/email-digest.hooks.js";
import { EmailDigestForm } from "../forms/email-digest-form.js";
import type { EmailDigest } from "../types/email-digest.js";
import { Button } from "@/components/ui/button";

export function EmailDigestDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useEmailDigest(params.id);
  const updateMutation = useUpdateEmailDigest();

  const handleSubmit = (formData: Partial<EmailDigest>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/email-digest") },
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
      <Button variant="ghost" onClick={() => router.push("/email-digest")}>← Back</Button>
      <EmailDigestForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}