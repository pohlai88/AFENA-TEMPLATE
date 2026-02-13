"use client";

// Detail page for Shareholder
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useShareholder, useUpdateShareholder } from "../hooks/shareholder.hooks.js";
import { ShareholderForm } from "../forms/shareholder-form.js";
import type { Shareholder } from "../types/shareholder.js";
import { Button } from "@/components/ui/button";

export function ShareholderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useShareholder(params.id);
  const updateMutation = useUpdateShareholder();

  const handleSubmit = (formData: Partial<Shareholder>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/shareholder") },
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
      <Button variant="ghost" onClick={() => router.push("/shareholder")}>← Back</Button>
      <ShareholderForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}