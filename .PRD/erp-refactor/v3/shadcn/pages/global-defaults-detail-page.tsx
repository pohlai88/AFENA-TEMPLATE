"use client";

// Detail page for Global Defaults
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useGlobalDefaults, useUpdateGlobalDefaults } from "../hooks/global-defaults.hooks.js";
import { GlobalDefaultsForm } from "../forms/global-defaults-form.js";
import type { GlobalDefaults } from "../types/global-defaults.js";
import { Button } from "@/components/ui/button";

export function GlobalDefaultsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useGlobalDefaults(params.id);
  const updateMutation = useUpdateGlobalDefaults();

  const handleSubmit = (formData: Partial<GlobalDefaults>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/global-defaults") },
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
      <Button variant="ghost" onClick={() => router.push("/global-defaults")}>← Back</Button>
      <GlobalDefaultsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}