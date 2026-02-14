"use client";

// Detail page for Asset Maintenance Team
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetMaintenanceTeam, useUpdateAssetMaintenanceTeam } from "../hooks/asset-maintenance-team.hooks.js";
import { AssetMaintenanceTeamForm } from "../forms/asset-maintenance-team-form.js";
import type { AssetMaintenanceTeam } from "../types/asset-maintenance-team.js";
import { Button } from "@/components/ui/button";

export function AssetMaintenanceTeamDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetMaintenanceTeam(params.id);
  const updateMutation = useUpdateAssetMaintenanceTeam();

  const handleSubmit = (formData: Partial<AssetMaintenanceTeam>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-maintenance-team") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-maintenance-team")}>← Back</Button>
      <AssetMaintenanceTeamForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}