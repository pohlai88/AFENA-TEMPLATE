"use client";

// List page for Manufacturer
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useManufacturerList } from "../hooks/manufacturer.hooks.js";
import { manufacturerColumns } from "../columns/manufacturer-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ManufacturerListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useManufacturerList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manufacturer</h1>
        <Button onClick={() => router.push("/manufacturer/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={manufacturerColumns}
              data={data}
              onRowClick={(row) => router.push(`/manufacturer/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}