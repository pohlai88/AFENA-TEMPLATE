"use client";

// Detail page for Lost Reason Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLostReasonDetail, useUpdateLostReasonDetail } from "../hooks/lost-reason-detail.hooks.js";
import { LostReasonDetailForm } from "../forms/lost-reason-detail-form.js";
import type { LostReasonDetail } from "../types/lost-reason-detail.js";
import { Button } from "@/components/ui/button";

export function LostReasonDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLostReasonDetail(params.id);
  const updateMutation = useUpdateLostReasonDetail();

  const handleSubmit = (formData: Partial<LostReasonDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/lost-reason-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/lost-reason-detail")}>← Back</Button>
      <LostReasonDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}