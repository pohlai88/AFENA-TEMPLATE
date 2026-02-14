"use client";

// Detail page for Target Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTargetDetail, useUpdateTargetDetail } from "../hooks/target-detail.hooks.js";
import { TargetDetailForm } from "../forms/target-detail-form.js";
import type { TargetDetail } from "../types/target-detail.js";
import { Button } from "@/components/ui/button";

export function TargetDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTargetDetail(params.id);
  const updateMutation = useUpdateTargetDetail();

  const handleSubmit = (formData: Partial<TargetDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/target-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/target-detail")}>← Back</Button>
      <TargetDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}