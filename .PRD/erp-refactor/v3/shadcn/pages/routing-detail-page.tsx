"use client";

// Detail page for Routing
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useRouting, useUpdateRouting } from "../hooks/routing.hooks.js";
import { RoutingForm } from "../forms/routing-form.js";
import type { Routing } from "../types/routing.js";
import { Button } from "@/components/ui/button";

export function RoutingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useRouting(params.id);
  const updateMutation = useUpdateRouting();

  const handleSubmit = (formData: Partial<Routing>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/routing") },
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
      <Button variant="ghost" onClick={() => router.push("/routing")}>← Back</Button>
      <RoutingForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}