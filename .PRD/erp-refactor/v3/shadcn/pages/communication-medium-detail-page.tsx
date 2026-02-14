"use client";

// Detail page for Communication Medium
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCommunicationMedium, useUpdateCommunicationMedium } from "../hooks/communication-medium.hooks.js";
import { CommunicationMediumForm } from "../forms/communication-medium-form.js";
import type { CommunicationMedium } from "../types/communication-medium.js";
import { Button } from "@/components/ui/button";

export function CommunicationMediumDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCommunicationMedium(params.id);
  const updateMutation = useUpdateCommunicationMedium();

  const handleSubmit = (formData: Partial<CommunicationMedium>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/communication-medium") },
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
      <Button variant="ghost" onClick={() => router.push("/communication-medium")}>← Back</Button>
      <CommunicationMediumForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}