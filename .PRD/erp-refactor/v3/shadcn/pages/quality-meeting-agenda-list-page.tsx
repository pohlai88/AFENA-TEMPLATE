"use client";

// List page for Quality Meeting Agenda
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityMeetingAgendaList } from "../hooks/quality-meeting-agenda.hooks.js";
import { qualityMeetingAgendaColumns } from "../columns/quality-meeting-agenda-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityMeetingAgendaListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityMeetingAgendaList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Meeting Agenda</h1>
        <Button onClick={() => router.push("/quality-meeting-agenda/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityMeetingAgendaColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-meeting-agenda/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}