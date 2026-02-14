"use client";

// Detail page for Share Transfer
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useShareTransfer, useUpdateShareTransfer } from "../hooks/share-transfer.hooks.js";
import { ShareTransferForm } from "../forms/share-transfer-form.js";
import type { ShareTransfer } from "../types/share-transfer.js";
import { Button } from "@/components/ui/button";

export function ShareTransferDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useShareTransfer(params.id);
  const updateMutation = useUpdateShareTransfer();

  const handleSubmit = (formData: Partial<ShareTransfer>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/share-transfer") },
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
      <Button variant="ghost" onClick={() => router.push("/share-transfer")}>← Back</Button>
      <ShareTransferForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}