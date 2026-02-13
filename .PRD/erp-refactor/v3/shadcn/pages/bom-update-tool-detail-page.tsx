"use client";

// Detail page for BOM Update Tool
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBomUpdateTool, useUpdateBomUpdateTool } from "../hooks/bom-update-tool.hooks.js";
import { BomUpdateToolForm } from "../forms/bom-update-tool-form.js";
import type { BomUpdateTool } from "../types/bom-update-tool.js";
import { Button } from "@/components/ui/button";

export function BomUpdateToolDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBomUpdateTool(params.id);
  const updateMutation = useUpdateBomUpdateTool();

  const handleSubmit = (formData: Partial<BomUpdateTool>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bom-update-tool") },
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
      <Button variant="ghost" onClick={() => router.push("/bom-update-tool")}>← Back</Button>
      <BomUpdateToolForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}