"use client";

// Detail page for Telephony Call Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTelephonyCallType, useUpdateTelephonyCallType } from "../hooks/telephony-call-type.hooks.js";
import { TelephonyCallTypeForm } from "../forms/telephony-call-type-form.js";
import type { TelephonyCallType } from "../types/telephony-call-type.js";
import { Button } from "@/components/ui/button";

export function TelephonyCallTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTelephonyCallType(params.id);
  const updateMutation = useUpdateTelephonyCallType();

  const handleSubmit = (formData: Partial<TelephonyCallType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/telephony-call-type") },
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
      <Button variant="ghost" onClick={() => router.push("/telephony-call-type")}>← Back</Button>
      <TelephonyCallTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}