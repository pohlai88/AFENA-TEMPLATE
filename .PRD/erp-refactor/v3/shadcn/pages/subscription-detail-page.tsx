"use client";

// Detail page for Subscription
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubscription, useUpdateSubscription } from "../hooks/subscription.hooks.js";
import { SubscriptionForm } from "../forms/subscription-form.js";
import type { Subscription } from "../types/subscription.js";
import { Button } from "@/components/ui/button";

export function SubscriptionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubscription(params.id);
  const updateMutation = useUpdateSubscription();

  const handleSubmit = (formData: Partial<Subscription>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subscription") },
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
      <Button variant="ghost" onClick={() => router.push("/subscription")}>← Back</Button>
      <SubscriptionForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}