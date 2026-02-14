"use client";

// Detail page for Terms and Conditions
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTermsAndConditions, useUpdateTermsAndConditions } from "../hooks/terms-and-conditions.hooks.js";
import { TermsAndConditionsForm } from "../forms/terms-and-conditions-form.js";
import type { TermsAndConditions } from "../types/terms-and-conditions.js";
import { Button } from "@/components/ui/button";

export function TermsAndConditionsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTermsAndConditions(params.id);
  const updateMutation = useUpdateTermsAndConditions();

  const handleSubmit = (formData: Partial<TermsAndConditions>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/terms-and-conditions") },
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
      <Button variant="ghost" onClick={() => router.push("/terms-and-conditions")}>← Back</Button>
      <TermsAndConditionsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}