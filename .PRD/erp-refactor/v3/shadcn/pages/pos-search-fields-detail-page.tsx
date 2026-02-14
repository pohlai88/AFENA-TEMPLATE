"use client";

// Detail page for POS Search Fields
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosSearchFields, useUpdatePosSearchFields } from "../hooks/pos-search-fields.hooks.js";
import { PosSearchFieldsForm } from "../forms/pos-search-fields-form.js";
import type { PosSearchFields } from "../types/pos-search-fields.js";
import { Button } from "@/components/ui/button";

export function PosSearchFieldsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosSearchFields(params.id);
  const updateMutation = useUpdatePosSearchFields();

  const handleSubmit = (formData: Partial<PosSearchFields>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-search-fields") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-search-fields")}>← Back</Button>
      <PosSearchFieldsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}