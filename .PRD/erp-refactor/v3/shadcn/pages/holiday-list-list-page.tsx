"use client";

// List page for Holiday List
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useHolidayListList } from "../hooks/holiday-list.hooks.js";
import { holidayListColumns } from "../columns/holiday-list-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HolidayListListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useHolidayListList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Holiday List</h1>
        <Button onClick={() => router.push("/holiday-list/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={holidayListColumns}
              data={data}
              onRowClick={(row) => router.push(`/holiday-list/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}