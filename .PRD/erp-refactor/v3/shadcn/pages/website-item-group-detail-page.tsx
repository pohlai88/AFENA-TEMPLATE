"use client";

// Detail page for Website Item Group
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useWebsiteItemGroup, useUpdateWebsiteItemGroup } from "../hooks/website-item-group.hooks.js";
import { WebsiteItemGroupForm } from "../forms/website-item-group-form.js";
import type { WebsiteItemGroup } from "../types/website-item-group.js";
import { Button } from "@/components/ui/button";

export function WebsiteItemGroupDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useWebsiteItemGroup(params.id);
  const updateMutation = useUpdateWebsiteItemGroup();

  const handleSubmit = (formData: Partial<WebsiteItemGroup>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/website-item-group") },
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
      <Button variant="ghost" onClick={() => router.push("/website-item-group")}>← Back</Button>
      <WebsiteItemGroupForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}