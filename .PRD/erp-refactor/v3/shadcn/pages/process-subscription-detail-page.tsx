"use client";

// Detail page for Process Subscription
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProcessSubscription, useUpdateProcessSubscription } from "../hooks/process-subscription.hooks.js";
import { ProcessSubscriptionForm } from "../forms/process-subscription-form.js";
import type { ProcessSubscription } from "../types/process-subscription.js";
import { Button } from "@/components/ui/button";

export function ProcessSubscriptionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProcessSubscription(params.id);
  const updateMutation = useUpdateProcessSubscription();

  const handleSubmit = (formData: Partial<ProcessSubscription>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/process-subscription") },
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
      <Button variant="ghost" onClick={() => router.push("/process-subscription")}>← Back</Button>
      <ProcessSubscriptionForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}