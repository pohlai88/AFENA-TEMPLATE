"use client";

// List page for Availability Of Slots
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAvailabilityOfSlotsList } from "../hooks/availability-of-slots.hooks.js";
import { availabilityOfSlotsColumns } from "../columns/availability-of-slots-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AvailabilityOfSlotsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAvailabilityOfSlotsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Availability Of Slots</h1>
        <Button onClick={() => router.push("/availability-of-slots/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={availabilityOfSlotsColumns}
              data={data}
              onRowClick={(row) => router.push(`/availability-of-slots/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}