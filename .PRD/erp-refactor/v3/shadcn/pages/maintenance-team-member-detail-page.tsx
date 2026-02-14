"use client";

// Detail page for Maintenance Team Member
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useMaintenanceTeamMember, useUpdateMaintenanceTeamMember } from "../hooks/maintenance-team-member.hooks.js";
import { MaintenanceTeamMemberForm } from "../forms/maintenance-team-member-form.js";
import type { MaintenanceTeamMember } from "../types/maintenance-team-member.js";
import { Button } from "@/components/ui/button";

export function MaintenanceTeamMemberDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useMaintenanceTeamMember(params.id);
  const updateMutation = useUpdateMaintenanceTeamMember();

  const handleSubmit = (formData: Partial<MaintenanceTeamMember>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/maintenance-team-member") },
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
      <Button variant="ghost" onClick={() => router.push("/maintenance-team-member")}>← Back</Button>
      <MaintenanceTeamMemberForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}