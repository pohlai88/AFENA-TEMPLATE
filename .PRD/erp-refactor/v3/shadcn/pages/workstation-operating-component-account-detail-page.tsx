"use client";

// Detail page for Workstation Operating Component Account
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useWorkstationOperatingComponentAccount, useUpdateWorkstationOperatingComponentAccount } from "../hooks/workstation-operating-component-account.hooks.js";
import { WorkstationOperatingComponentAccountForm } from "../forms/workstation-operating-component-account-form.js";
import type { WorkstationOperatingComponentAccount } from "../types/workstation-operating-component-account.js";
import { Button } from "@/components/ui/button";

export function WorkstationOperatingComponentAccountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useWorkstationOperatingComponentAccount(params.id);
  const updateMutation = useUpdateWorkstationOperatingComponentAccount();

  const handleSubmit = (formData: Partial<WorkstationOperatingComponentAccount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/workstation-operating-component-account") },
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
      <Button variant="ghost" onClick={() => router.push("/workstation-operating-component-account")}>← Back</Button>
      <WorkstationOperatingComponentAccountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}