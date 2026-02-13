"use client";

// List page for Campaign Email Schedule
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCampaignEmailScheduleList } from "../hooks/campaign-email-schedule.hooks.js";
import { campaignEmailScheduleColumns } from "../columns/campaign-email-schedule-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CampaignEmailScheduleListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCampaignEmailScheduleList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Campaign Email Schedule</h1>
        <Button onClick={() => router.push("/campaign-email-schedule/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={campaignEmailScheduleColumns}
              data={data}
              onRowClick={(row) => router.push(`/campaign-email-schedule/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}