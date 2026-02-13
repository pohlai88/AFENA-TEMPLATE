"use client";

// List page for Workstation Cost
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useWorkstationCostList } from "../hooks/workstation-cost.hooks.js";
import { workstationCostColumns } from "../columns/workstation-cost-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WorkstationCostListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useWorkstationCostList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Workstation Cost</h1>
        <Button onClick={() => router.push("/workstation-cost/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={workstationCostColumns}
              data={data}
              onRowClick={(row) => router.push(`/workstation-cost/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}