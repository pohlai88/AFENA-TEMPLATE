"use client";

// Detail page for BOM Update Log
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBomUpdateLog, useUpdateBomUpdateLog } from "../hooks/bom-update-log.hooks.js";
import { BomUpdateLogForm } from "../forms/bom-update-log-form.js";
import type { BomUpdateLog } from "../types/bom-update-log.js";
import { Button } from "@/components/ui/button";

export function BomUpdateLogDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBomUpdateLog(params.id);
  const updateMutation = useUpdateBomUpdateLog();

  const handleSubmit = (formData: Partial<BomUpdateLog>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bom-update-log") },
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
      <Button variant="ghost" onClick={() => router.push("/bom-update-log")}>← Back</Button>
      <BomUpdateLogForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}