"use client";

// Detail page for Journal Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useJournalEntry, useUpdateJournalEntry } from "../hooks/journal-entry.hooks.js";
import { JournalEntryForm } from "../forms/journal-entry-form.js";
import type { JournalEntry } from "../types/journal-entry.js";
import { Button } from "@/components/ui/button";

export function JournalEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useJournalEntry(params.id);
  const updateMutation = useUpdateJournalEntry();

  const handleSubmit = (formData: Partial<JournalEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/journal-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/journal-entry")}>← Back</Button>
      <JournalEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}