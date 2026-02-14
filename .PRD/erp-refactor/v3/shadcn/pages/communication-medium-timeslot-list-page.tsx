"use client";

// List page for Communication Medium Timeslot
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCommunicationMediumTimeslotList } from "../hooks/communication-medium-timeslot.hooks.js";
import { communicationMediumTimeslotColumns } from "../columns/communication-medium-timeslot-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CommunicationMediumTimeslotListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCommunicationMediumTimeslotList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Communication Medium Timeslot</h1>
        <Button onClick={() => router.push("/communication-medium-timeslot/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={communicationMediumTimeslotColumns}
              data={data}
              onRowClick={(row) => router.push(`/communication-medium-timeslot/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}