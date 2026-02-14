"use client";

// Detail page for Designation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDesignation, useUpdateDesignation } from "../hooks/designation.hooks.js";
import { DesignationForm } from "../forms/designation-form.js";
import type { Designation } from "../types/designation.js";
import { Button } from "@/components/ui/button";

export function DesignationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDesignation(params.id);
  const updateMutation = useUpdateDesignation();

  const handleSubmit = (formData: Partial<Designation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/designation") },
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
      <Button variant="ghost" onClick={() => router.push("/designation")}>← Back</Button>
      <DesignationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}