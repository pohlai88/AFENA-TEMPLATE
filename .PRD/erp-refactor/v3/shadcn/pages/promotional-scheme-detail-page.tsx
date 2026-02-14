"use client";

// Detail page for Promotional Scheme
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePromotionalScheme, useUpdatePromotionalScheme } from "../hooks/promotional-scheme.hooks.js";
import { PromotionalSchemeForm } from "../forms/promotional-scheme-form.js";
import type { PromotionalScheme } from "../types/promotional-scheme.js";
import { Button } from "@/components/ui/button";

export function PromotionalSchemeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePromotionalScheme(params.id);
  const updateMutation = useUpdatePromotionalScheme();

  const handleSubmit = (formData: Partial<PromotionalScheme>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/promotional-scheme") },
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
      <Button variant="ghost" onClick={() => router.push("/promotional-scheme")}>← Back</Button>
      <PromotionalSchemeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}