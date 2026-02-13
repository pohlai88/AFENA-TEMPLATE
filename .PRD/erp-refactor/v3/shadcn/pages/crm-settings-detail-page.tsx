"use client";

// Detail page for CRM Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCrmSettings, useUpdateCrmSettings } from "../hooks/crm-settings.hooks.js";
import { CrmSettingsForm } from "../forms/crm-settings-form.js";
import type { CrmSettings } from "../types/crm-settings.js";
import { Button } from "@/components/ui/button";

export function CrmSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCrmSettings(params.id);
  const updateMutation = useUpdateCrmSettings();

  const handleSubmit = (formData: Partial<CrmSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/crm-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/crm-settings")}>← Back</Button>
      <CrmSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}