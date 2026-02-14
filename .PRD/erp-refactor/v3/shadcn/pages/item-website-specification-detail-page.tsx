"use client";

// Detail page for Item Website Specification
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemWebsiteSpecification, useUpdateItemWebsiteSpecification } from "../hooks/item-website-specification.hooks.js";
import { ItemWebsiteSpecificationForm } from "../forms/item-website-specification-form.js";
import type { ItemWebsiteSpecification } from "../types/item-website-specification.js";
import { Button } from "@/components/ui/button";

export function ItemWebsiteSpecificationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemWebsiteSpecification(params.id);
  const updateMutation = useUpdateItemWebsiteSpecification();

  const handleSubmit = (formData: Partial<ItemWebsiteSpecification>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-website-specification") },
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
      <Button variant="ghost" onClick={() => router.push("/item-website-specification")}>← Back</Button>
      <ItemWebsiteSpecificationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}