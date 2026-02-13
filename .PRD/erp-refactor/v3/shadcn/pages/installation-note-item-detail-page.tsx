"use client";

// Detail page for Installation Note Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useInstallationNoteItem, useUpdateInstallationNoteItem } from "../hooks/installation-note-item.hooks.js";
import { InstallationNoteItemForm } from "../forms/installation-note-item-form.js";
import type { InstallationNoteItem } from "../types/installation-note-item.js";
import { Button } from "@/components/ui/button";

export function InstallationNoteItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useInstallationNoteItem(params.id);
  const updateMutation = useUpdateInstallationNoteItem();

  const handleSubmit = (formData: Partial<InstallationNoteItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/installation-note-item") },
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
      <Button variant="ghost" onClick={() => router.push("/installation-note-item")}>← Back</Button>
      <InstallationNoteItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}