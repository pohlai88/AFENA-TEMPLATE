"use client";

// Detail page for Bisect Nodes
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBisectNodes, useUpdateBisectNodes } from "../hooks/bisect-nodes.hooks.js";
import { BisectNodesForm } from "../forms/bisect-nodes-form.js";
import type { BisectNodes } from "../types/bisect-nodes.js";
import { Button } from "@/components/ui/button";

export function BisectNodesDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBisectNodes(params.id);
  const updateMutation = useUpdateBisectNodes();

  const handleSubmit = (formData: Partial<BisectNodes>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bisect-nodes") },
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
      <Button variant="ghost" onClick={() => router.push("/bisect-nodes")}>← Back</Button>
      <BisectNodesForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}