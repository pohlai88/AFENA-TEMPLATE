"use client";

// Detail page for Applicable On Account
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useApplicableOnAccount, useUpdateApplicableOnAccount } from "../hooks/applicable-on-account.hooks.js";
import { ApplicableOnAccountForm } from "../forms/applicable-on-account-form.js";
import type { ApplicableOnAccount } from "../types/applicable-on-account.js";
import { Button } from "@/components/ui/button";

export function ApplicableOnAccountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useApplicableOnAccount(params.id);
  const updateMutation = useUpdateApplicableOnAccount();

  const handleSubmit = (formData: Partial<ApplicableOnAccount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/applicable-on-account") },
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
      <Button variant="ghost" onClick={() => router.push("/applicable-on-account")}>← Back</Button>
      <ApplicableOnAccountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}