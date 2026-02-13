"use client";

// Detail page for Subscription Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubscriptionSettings, useUpdateSubscriptionSettings } from "../hooks/subscription-settings.hooks.js";
import { SubscriptionSettingsForm } from "../forms/subscription-settings-form.js";
import type { SubscriptionSettings } from "../types/subscription-settings.js";
import { Button } from "@/components/ui/button";

export function SubscriptionSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubscriptionSettings(params.id);
  const updateMutation = useUpdateSubscriptionSettings();

  const handleSubmit = (formData: Partial<SubscriptionSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subscription-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/subscription-settings")}>← Back</Button>
      <SubscriptionSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}