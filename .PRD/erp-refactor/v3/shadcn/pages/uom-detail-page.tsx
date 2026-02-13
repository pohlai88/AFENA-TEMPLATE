"use client";

// Detail page for UOM
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useUom, useUpdateUom } from "../hooks/uom.hooks.js";
import { UomForm } from "../forms/uom-form.js";
import type { Uom } from "../types/uom.js";
import { Button } from "@/components/ui/button";

export function UomDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useUom(params.id);
  const updateMutation = useUpdateUom();

  const handleSubmit = (formData: Partial<Uom>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/uom") },
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
      <Button variant="ghost" onClick={() => router.push("/uom")}>← Back</Button>
      <UomForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}