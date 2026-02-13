"use client";

// Detail page for Repost Item Valuation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useRepostItemValuation, useUpdateRepostItemValuation } from "../hooks/repost-item-valuation.hooks.js";
import { RepostItemValuationForm } from "../forms/repost-item-valuation-form.js";
import type { RepostItemValuation } from "../types/repost-item-valuation.js";
import { Button } from "@/components/ui/button";

export function RepostItemValuationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useRepostItemValuation(params.id);
  const updateMutation = useUpdateRepostItemValuation();

  const handleSubmit = (formData: Partial<RepostItemValuation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/repost-item-valuation") },
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
      <Button variant="ghost" onClick={() => router.push("/repost-item-valuation")}>← Back</Button>
      <RepostItemValuationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}