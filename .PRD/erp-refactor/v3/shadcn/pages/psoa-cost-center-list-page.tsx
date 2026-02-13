"use client";

// List page for PSOA Cost Center
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePsoaCostCenterList } from "../hooks/psoa-cost-center.hooks.js";
import { psoaCostCenterColumns } from "../columns/psoa-cost-center-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PsoaCostCenterListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePsoaCostCenterList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">PSOA Cost Center</h1>
        <Button onClick={() => router.push("/psoa-cost-center/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={psoaCostCenterColumns}
              data={data}
              onRowClick={(row) => router.push(`/psoa-cost-center/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}