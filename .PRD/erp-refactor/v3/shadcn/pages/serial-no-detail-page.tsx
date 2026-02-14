"use client";

// Detail page for Serial No
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSerialNo, useUpdateSerialNo } from "../hooks/serial-no.hooks.js";
import { SerialNoForm } from "../forms/serial-no-form.js";
import type { SerialNo } from "../types/serial-no.js";
import { Button } from "@/components/ui/button";

export function SerialNoDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSerialNo(params.id);
  const updateMutation = useUpdateSerialNo();

  const handleSubmit = (formData: Partial<SerialNo>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/serial-no") },
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
      <Button variant="ghost" onClick={() => router.push("/serial-no")}>← Back</Button>
      <SerialNoForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}