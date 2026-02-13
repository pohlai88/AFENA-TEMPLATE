"use client";

// Detail page for Campaign
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCampaign, useUpdateCampaign } from "../hooks/campaign.hooks.js";
import { CampaignForm } from "../forms/campaign-form.js";
import type { Campaign } from "../types/campaign.js";
import { Button } from "@/components/ui/button";

export function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCampaign(params.id);
  const updateMutation = useUpdateCampaign();

  const handleSubmit = (formData: Partial<Campaign>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/campaign") },
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
      <Button variant="ghost" onClick={() => router.push("/campaign")}>← Back</Button>
      <CampaignForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}