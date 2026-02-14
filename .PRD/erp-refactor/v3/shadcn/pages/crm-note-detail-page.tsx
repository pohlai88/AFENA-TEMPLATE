"use client";

// Detail page for CRM Note
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCrmNote, useUpdateCrmNote } from "../hooks/crm-note.hooks.js";
import { CrmNoteForm } from "../forms/crm-note-form.js";
import type { CrmNote } from "../types/crm-note.js";
import { Button } from "@/components/ui/button";

export function CrmNoteDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCrmNote(params.id);
  const updateMutation = useUpdateCrmNote();

  const handleSubmit = (formData: Partial<CrmNote>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/crm-note") },
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
      <Button variant="ghost" onClick={() => router.push("/crm-note")}>← Back</Button>
      <CrmNoteForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}