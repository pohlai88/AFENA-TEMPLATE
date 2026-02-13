"use client";

// List page for Quality Meeting Minutes
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityMeetingMinutesList } from "../hooks/quality-meeting-minutes.hooks.js";
import { qualityMeetingMinutesColumns } from "../columns/quality-meeting-minutes-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityMeetingMinutesListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityMeetingMinutesList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Meeting Minutes</h1>
        <Button onClick={() => router.push("/quality-meeting-minutes/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityMeetingMinutesColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-meeting-minutes/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}