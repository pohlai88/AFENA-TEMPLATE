"use client";

// Detail page for Journal Entry Template
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useJournalEntryTemplate, useUpdateJournalEntryTemplate } from "../hooks/journal-entry-template.hooks.js";
import { JournalEntryTemplateForm } from "../forms/journal-entry-template-form.js";
import type { JournalEntryTemplate } from "../types/journal-entry-template.js";
import { Button } from "@/components/ui/button";

export function JournalEntryTemplateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useJournalEntryTemplate(params.id);
  const updateMutation = useUpdateJournalEntryTemplate();

  const handleSubmit = (formData: Partial<JournalEntryTemplate>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/journal-entry-template") },
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
      <Button variant="ghost" onClick={() => router.push("/journal-entry-template")}>← Back</Button>
      <JournalEntryTemplateForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}