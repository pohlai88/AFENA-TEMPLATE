"use client";

// Detail page for Sales Team
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesTeam, useUpdateSalesTeam } from "../hooks/sales-team.hooks.js";
import { SalesTeamForm } from "../forms/sales-team-form.js";
import type { SalesTeam } from "../types/sales-team.js";
import { Button } from "@/components/ui/button";

export function SalesTeamDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesTeam(params.id);
  const updateMutation = useUpdateSalesTeam();

  const handleSubmit = (formData: Partial<SalesTeam>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-team") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-team")}>← Back</Button>
      <SalesTeamForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}