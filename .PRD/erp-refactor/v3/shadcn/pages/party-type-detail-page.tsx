"use client";

// Detail page for Party Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePartyType, useUpdatePartyType } from "../hooks/party-type.hooks.js";
import { PartyTypeForm } from "../forms/party-type-form.js";
import type { PartyType } from "../types/party-type.js";
import { Button } from "@/components/ui/button";

export function PartyTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePartyType(params.id);
  const updateMutation = useUpdatePartyType();

  const handleSubmit = (formData: Partial<PartyType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/party-type") },
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
      <Button variant="ghost" onClick={() => router.push("/party-type")}>← Back</Button>
      <PartyTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}