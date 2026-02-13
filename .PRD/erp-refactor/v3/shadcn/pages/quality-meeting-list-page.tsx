"use client";

// List page for Quality Meeting
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityMeetingList } from "../hooks/quality-meeting.hooks.js";
import { qualityMeetingColumns } from "../columns/quality-meeting-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityMeetingListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityMeetingList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Meeting</h1>
        <Button onClick={() => router.push("/quality-meeting/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityMeetingColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-meeting/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}