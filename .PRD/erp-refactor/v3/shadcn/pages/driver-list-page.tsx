"use client";

// List page for Driver
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useDriverList } from "../hooks/driver.hooks.js";
import { driverColumns } from "../columns/driver-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DriverListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDriverList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Driver</h1>
        <Button onClick={() => router.push("/driver/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={driverColumns}
              data={data}
              onRowClick={(row) => router.push(`/driver/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}