"use client";

// Detail page for Operation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useOperation, useUpdateOperation } from "../hooks/operation.hooks.js";
import { OperationForm } from "../forms/operation-form.js";
import type { Operation } from "../types/operation.js";
import { Button } from "@/components/ui/button";

export function OperationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useOperation(params.id);
  const updateMutation = useUpdateOperation();

  const handleSubmit = (formData: Partial<Operation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/operation") },
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
      <Button variant="ghost" onClick={() => router.push("/operation")}>← Back</Button>
      <OperationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}