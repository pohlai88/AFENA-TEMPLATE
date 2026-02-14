"use client";

// Detail page for Dunning Letter Text
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDunningLetterText, useUpdateDunningLetterText } from "../hooks/dunning-letter-text.hooks.js";
import { DunningLetterTextForm } from "../forms/dunning-letter-text-form.js";
import type { DunningLetterText } from "../types/dunning-letter-text.js";
import { Button } from "@/components/ui/button";

export function DunningLetterTextDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDunningLetterText(params.id);
  const updateMutation = useUpdateDunningLetterText();

  const handleSubmit = (formData: Partial<DunningLetterText>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/dunning-letter-text") },
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
      <Button variant="ghost" onClick={() => router.push("/dunning-letter-text")}>← Back</Button>
      <DunningLetterTextForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}