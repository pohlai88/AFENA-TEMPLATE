"use client";

// List page for Plant Floor
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePlantFloorList } from "../hooks/plant-floor.hooks.js";
import { plantFloorColumns } from "../columns/plant-floor-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PlantFloorListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePlantFloorList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Plant Floor</h1>
        <Button onClick={() => router.push("/plant-floor/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={plantFloorColumns}
              data={data}
              onRowClick={(row) => router.push(`/plant-floor/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}