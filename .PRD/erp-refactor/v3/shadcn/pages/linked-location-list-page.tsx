"use client";

// List page for Linked Location
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLinkedLocationList } from "../hooks/linked-location.hooks.js";
import { linkedLocationColumns } from "../columns/linked-location-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LinkedLocationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLinkedLocationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Linked Location</h1>
        <Button onClick={() => router.push("/linked-location/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={linkedLocationColumns}
              data={data}
              onRowClick={(row) => router.push(`/linked-location/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}