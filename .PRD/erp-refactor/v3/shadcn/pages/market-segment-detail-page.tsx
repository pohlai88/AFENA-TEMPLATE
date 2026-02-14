"use client";

// Detail page for Market Segment
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useMarketSegment, useUpdateMarketSegment } from "../hooks/market-segment.hooks.js";
import { MarketSegmentForm } from "../forms/market-segment-form.js";
import type { MarketSegment } from "../types/market-segment.js";
import { Button } from "@/components/ui/button";

export function MarketSegmentDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useMarketSegment(params.id);
  const updateMutation = useUpdateMarketSegment();

  const handleSubmit = (formData: Partial<MarketSegment>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/market-segment") },
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
      <Button variant="ghost" onClick={() => router.push("/market-segment")}>← Back</Button>
      <MarketSegmentForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}