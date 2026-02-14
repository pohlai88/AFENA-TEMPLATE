"use client";

// Detail page for Packing Slip
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePackingSlip, useUpdatePackingSlip } from "../hooks/packing-slip.hooks.js";
import { PackingSlipForm } from "../forms/packing-slip-form.js";
import type { PackingSlip } from "../types/packing-slip.js";
import { Button } from "@/components/ui/button";

export function PackingSlipDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePackingSlip(params.id);
  const updateMutation = useUpdatePackingSlip();

  const handleSubmit = (formData: Partial<PackingSlip>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/packing-slip") },
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
      <Button variant="ghost" onClick={() => router.push("/packing-slip")}>← Back</Button>
      <PackingSlipForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}