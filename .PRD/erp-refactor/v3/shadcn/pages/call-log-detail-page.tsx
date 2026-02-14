"use client";

// Detail page for Call Log
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCallLog, useUpdateCallLog } from "../hooks/call-log.hooks.js";
import { CallLogForm } from "../forms/call-log-form.js";
import type { CallLog } from "../types/call-log.js";
import { Button } from "@/components/ui/button";

export function CallLogDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCallLog(params.id);
  const updateMutation = useUpdateCallLog();

  const handleSubmit = (formData: Partial<CallLog>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/call-log") },
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
      <Button variant="ghost" onClick={() => router.push("/call-log")}>← Back</Button>
      <CallLogForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}