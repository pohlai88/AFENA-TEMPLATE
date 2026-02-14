"use client";

// Detail page for Chart of Accounts Importer
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useChartOfAccountsImporter, useUpdateChartOfAccountsImporter } from "../hooks/chart-of-accounts-importer.hooks.js";
import { ChartOfAccountsImporterForm } from "../forms/chart-of-accounts-importer-form.js";
import type { ChartOfAccountsImporter } from "../types/chart-of-accounts-importer.js";
import { Button } from "@/components/ui/button";

export function ChartOfAccountsImporterDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useChartOfAccountsImporter(params.id);
  const updateMutation = useUpdateChartOfAccountsImporter();

  const handleSubmit = (formData: Partial<ChartOfAccountsImporter>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/chart-of-accounts-importer") },
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
      <Button variant="ghost" onClick={() => router.push("/chart-of-accounts-importer")}>← Back</Button>
      <ChartOfAccountsImporterForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}