"use client";

// Detail page for Party Link
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePartyLink, useUpdatePartyLink } from "../hooks/party-link.hooks.js";
import { PartyLinkForm } from "../forms/party-link-form.js";
import type { PartyLink } from "../types/party-link.js";
import { Button } from "@/components/ui/button";

export function PartyLinkDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePartyLink(params.id);
  const updateMutation = useUpdatePartyLink();

  const handleSubmit = (formData: Partial<PartyLink>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/party-link") },
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
      <Button variant="ghost" onClick={() => router.push("/party-link")}>← Back</Button>
      <PartyLinkForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}