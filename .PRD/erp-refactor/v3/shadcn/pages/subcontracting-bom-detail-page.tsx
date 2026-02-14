"use client";

// Detail page for Subcontracting BOM
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubcontractingBom, useUpdateSubcontractingBom } from "../hooks/subcontracting-bom.hooks.js";
import { SubcontractingBomForm } from "../forms/subcontracting-bom-form.js";
import type { SubcontractingBom } from "../types/subcontracting-bom.js";
import { Button } from "@/components/ui/button";

export function SubcontractingBomDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubcontractingBom(params.id);
  const updateMutation = useUpdateSubcontractingBom();

  const handleSubmit = (formData: Partial<SubcontractingBom>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subcontracting-bom") },
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
      <Button variant="ghost" onClick={() => router.push("/subcontracting-bom")}>← Back</Button>
      <SubcontractingBomForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}