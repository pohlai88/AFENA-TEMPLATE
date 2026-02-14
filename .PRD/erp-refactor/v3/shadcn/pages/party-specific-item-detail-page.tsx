"use client";

// Detail page for Party Specific Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePartySpecificItem, useUpdatePartySpecificItem } from "../hooks/party-specific-item.hooks.js";
import { PartySpecificItemForm } from "../forms/party-specific-item-form.js";
import type { PartySpecificItem } from "../types/party-specific-item.js";
import { Button } from "@/components/ui/button";

export function PartySpecificItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePartySpecificItem(params.id);
  const updateMutation = useUpdatePartySpecificItem();

  const handleSubmit = (formData: Partial<PartySpecificItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/party-specific-item") },
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
      <Button variant="ghost" onClick={() => router.push("/party-specific-item")}>← Back</Button>
      <PartySpecificItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}