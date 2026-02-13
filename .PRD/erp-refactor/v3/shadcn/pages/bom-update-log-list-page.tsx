"use client";

// List page for BOM Update Log
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBomUpdateLogList } from "../hooks/bom-update-log.hooks.js";
import { bomUpdateLogColumns } from "../columns/bom-update-log-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BomUpdateLogListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBomUpdateLogList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">BOM Update Log</h1>
        <Button onClick={() => router.push("/bom-update-log/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bomUpdateLogColumns}
              data={data}
              onRowClick={(row) => router.push(`/bom-update-log/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}