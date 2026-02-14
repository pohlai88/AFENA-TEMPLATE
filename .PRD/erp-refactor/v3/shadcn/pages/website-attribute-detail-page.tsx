"use client";

// Detail page for Website Attribute
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useWebsiteAttribute, useUpdateWebsiteAttribute } from "../hooks/website-attribute.hooks.js";
import { WebsiteAttributeForm } from "../forms/website-attribute-form.js";
import type { WebsiteAttribute } from "../types/website-attribute.js";
import { Button } from "@/components/ui/button";

export function WebsiteAttributeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useWebsiteAttribute(params.id);
  const updateMutation = useUpdateWebsiteAttribute();

  const handleSubmit = (formData: Partial<WebsiteAttribute>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/website-attribute") },
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
      <Button variant="ghost" onClick={() => router.push("/website-attribute")}>← Back</Button>
      <WebsiteAttributeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}