"use client";

// Detail page for Campaign Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCampaignItem, useUpdateCampaignItem } from "../hooks/campaign-item.hooks.js";
import { CampaignItemForm } from "../forms/campaign-item-form.js";
import type { CampaignItem } from "../types/campaign-item.js";
import { Button } from "@/components/ui/button";

export function CampaignItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCampaignItem(params.id);
  const updateMutation = useUpdateCampaignItem();

  const handleSubmit = (formData: Partial<CampaignItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/campaign-item") },
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
      <Button variant="ghost" onClick={() => router.push("/campaign-item")}>← Back</Button>
      <CampaignItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}