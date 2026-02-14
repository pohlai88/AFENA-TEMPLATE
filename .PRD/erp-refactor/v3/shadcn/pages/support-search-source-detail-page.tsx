"use client";

// Detail page for Support Search Source
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupportSearchSource, useUpdateSupportSearchSource } from "../hooks/support-search-source.hooks.js";
import { SupportSearchSourceForm } from "../forms/support-search-source-form.js";
import type { SupportSearchSource } from "../types/support-search-source.js";
import { Button } from "@/components/ui/button";

export function SupportSearchSourceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupportSearchSource(params.id);
  const updateMutation = useUpdateSupportSearchSource();

  const handleSubmit = (formData: Partial<SupportSearchSource>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/support-search-source") },
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
      <Button variant="ghost" onClick={() => router.push("/support-search-source")}>← Back</Button>
      <SupportSearchSourceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}