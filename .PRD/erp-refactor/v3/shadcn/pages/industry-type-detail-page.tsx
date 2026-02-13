"use client";

// Detail page for Industry Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useIndustryType, useUpdateIndustryType } from "../hooks/industry-type.hooks.js";
import { IndustryTypeForm } from "../forms/industry-type-form.js";
import type { IndustryType } from "../types/industry-type.js";
import { Button } from "@/components/ui/button";

export function IndustryTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useIndustryType(params.id);
  const updateMutation = useUpdateIndustryType();

  const handleSubmit = (formData: Partial<IndustryType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/industry-type") },
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
      <Button variant="ghost" onClick={() => router.push("/industry-type")}>← Back</Button>
      <IndustryTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}