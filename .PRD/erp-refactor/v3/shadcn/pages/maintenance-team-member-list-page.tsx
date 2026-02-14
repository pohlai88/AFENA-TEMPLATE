"use client";

// List page for Maintenance Team Member
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useMaintenanceTeamMemberList } from "../hooks/maintenance-team-member.hooks.js";
import { maintenanceTeamMemberColumns } from "../columns/maintenance-team-member-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaintenanceTeamMemberListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useMaintenanceTeamMemberList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Team Member</h1>
        <Button onClick={() => router.push("/maintenance-team-member/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={maintenanceTeamMemberColumns}
              data={data}
              onRowClick={(row) => router.push(`/maintenance-team-member/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}