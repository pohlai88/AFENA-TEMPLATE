"use client";

// Detail page for SMS Center
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSmsCenter, useUpdateSmsCenter } from "../hooks/sms-center.hooks.js";
import { SmsCenterForm } from "../forms/sms-center-form.js";
import type { SmsCenter } from "../types/sms-center.js";
import { Button } from "@/components/ui/button";

export function SmsCenterDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSmsCenter(params.id);
  const updateMutation = useUpdateSmsCenter();

  const handleSubmit = (formData: Partial<SmsCenter>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sms-center") },
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
      <Button variant="ghost" onClick={() => router.push("/sms-center")}>← Back</Button>
      <SmsCenterForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}