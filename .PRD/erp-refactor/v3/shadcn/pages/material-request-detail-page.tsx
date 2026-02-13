"use client";

// Detail page for Material Request
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useMaterialRequest, useUpdateMaterialRequest } from "../hooks/material-request.hooks.js";
import { MaterialRequestForm } from "../forms/material-request-form.js";
import type { MaterialRequest } from "../types/material-request.js";
import { Button } from "@/components/ui/button";

export function MaterialRequestDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useMaterialRequest(params.id);
  const updateMutation = useUpdateMaterialRequest();

  const handleSubmit = (formData: Partial<MaterialRequest>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/material-request") },
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
      <Button variant="ghost" onClick={() => router.push("/material-request")}>← Back</Button>
      <MaterialRequestForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}