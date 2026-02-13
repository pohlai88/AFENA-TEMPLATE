"use client";

// Detail page for Email Campaign
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useEmailCampaign, useUpdateEmailCampaign } from "../hooks/email-campaign.hooks.js";
import { EmailCampaignForm } from "../forms/email-campaign-form.js";
import type { EmailCampaign } from "../types/email-campaign.js";
import { Button } from "@/components/ui/button";

export function EmailCampaignDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useEmailCampaign(params.id);
  const updateMutation = useUpdateEmailCampaign();

  const handleSubmit = (formData: Partial<EmailCampaign>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/email-campaign") },
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
      <Button variant="ghost" onClick={() => router.push("/email-campaign")}>← Back</Button>
      <EmailCampaignForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}