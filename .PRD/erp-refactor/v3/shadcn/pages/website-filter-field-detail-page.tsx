"use client";

// Detail page for Website Filter Field
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useWebsiteFilterField, useUpdateWebsiteFilterField } from "../hooks/website-filter-field.hooks.js";
import { WebsiteFilterFieldForm } from "../forms/website-filter-field-form.js";
import type { WebsiteFilterField } from "../types/website-filter-field.js";
import { Button } from "@/components/ui/button";

export function WebsiteFilterFieldDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useWebsiteFilterField(params.id);
  const updateMutation = useUpdateWebsiteFilterField();

  const handleSubmit = (formData: Partial<WebsiteFilterField>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/website-filter-field") },
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
      <Button variant="ghost" onClick={() => router.push("/website-filter-field")}>← Back</Button>
      <WebsiteFilterFieldForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}