"use client";

// Detail page for Code List
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCodeList, useUpdateCodeList } from "../hooks/code-list.hooks.js";
import { CodeListForm } from "../forms/code-list-form.js";
import type { CodeList } from "../types/code-list.js";
import { Button } from "@/components/ui/button";

export function CodeListDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCodeList(params.id);
  const updateMutation = useUpdateCodeList();

  const handleSubmit = (formData: Partial<CodeList>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/code-list") },
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
      <Button variant="ghost" onClick={() => router.push("/code-list")}>← Back</Button>
      <CodeListForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}