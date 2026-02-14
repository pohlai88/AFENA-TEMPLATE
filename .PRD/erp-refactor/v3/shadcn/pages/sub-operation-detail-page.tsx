"use client";

// Detail page for Sub Operation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubOperation, useUpdateSubOperation } from "../hooks/sub-operation.hooks.js";
import { SubOperationForm } from "../forms/sub-operation-form.js";
import type { SubOperation } from "../types/sub-operation.js";
import { Button } from "@/components/ui/button";

export function SubOperationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubOperation(params.id);
  const updateMutation = useUpdateSubOperation();

  const handleSubmit = (formData: Partial<SubOperation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sub-operation") },
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
      <Button variant="ghost" onClick={() => router.push("/sub-operation")}>← Back</Button>
      <SubOperationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}