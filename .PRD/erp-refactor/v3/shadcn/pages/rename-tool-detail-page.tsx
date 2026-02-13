"use client";

// Detail page for Rename Tool
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useRenameTool, useUpdateRenameTool } from "../hooks/rename-tool.hooks.js";
import { RenameToolForm } from "../forms/rename-tool-form.js";
import type { RenameTool } from "../types/rename-tool.js";
import { Button } from "@/components/ui/button";

export function RenameToolDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useRenameTool(params.id);
  const updateMutation = useUpdateRenameTool();

  const handleSubmit = (formData: Partial<RenameTool>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/rename-tool") },
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
      <Button variant="ghost" onClick={() => router.push("/rename-tool")}>← Back</Button>
      <RenameToolForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}