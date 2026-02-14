"use client";

// Detail page for Closed Document
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useClosedDocument, useUpdateClosedDocument } from "../hooks/closed-document.hooks.js";
import { ClosedDocumentForm } from "../forms/closed-document-form.js";
import type { ClosedDocument } from "../types/closed-document.js";
import { Button } from "@/components/ui/button";

export function ClosedDocumentDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useClosedDocument(params.id);
  const updateMutation = useUpdateClosedDocument();

  const handleSubmit = (formData: Partial<ClosedDocument>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/closed-document") },
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
      <Button variant="ghost" onClick={() => router.push("/closed-document")}>← Back</Button>
      <ClosedDocumentForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}