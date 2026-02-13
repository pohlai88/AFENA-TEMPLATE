"use client";

// Detail page for Installation Note
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useInstallationNote, useUpdateInstallationNote } from "../hooks/installation-note.hooks.js";
import { InstallationNoteForm } from "../forms/installation-note-form.js";
import type { InstallationNote } from "../types/installation-note.js";
import { Button } from "@/components/ui/button";

export function InstallationNoteDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useInstallationNote(params.id);
  const updateMutation = useUpdateInstallationNote();

  const handleSubmit = (formData: Partial<InstallationNote>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/installation-note") },
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
      <Button variant="ghost" onClick={() => router.push("/installation-note")}>← Back</Button>
      <InstallationNoteForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}