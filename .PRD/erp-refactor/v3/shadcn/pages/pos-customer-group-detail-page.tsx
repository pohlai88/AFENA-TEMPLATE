"use client";

// Detail page for POS Customer Group
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosCustomerGroup, useUpdatePosCustomerGroup } from "../hooks/pos-customer-group.hooks.js";
import { PosCustomerGroupForm } from "../forms/pos-customer-group-form.js";
import type { PosCustomerGroup } from "../types/pos-customer-group.js";
import { Button } from "@/components/ui/button";

export function PosCustomerGroupDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosCustomerGroup(params.id);
  const updateMutation = useUpdatePosCustomerGroup();

  const handleSubmit = (formData: Partial<PosCustomerGroup>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-customer-group") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-customer-group")}>← Back</Button>
      <PosCustomerGroupForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}