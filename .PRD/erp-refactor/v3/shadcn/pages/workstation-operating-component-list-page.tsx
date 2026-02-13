"use client";

// List page for Workstation Operating Component
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useWorkstationOperatingComponentList } from "../hooks/workstation-operating-component.hooks.js";
import { workstationOperatingComponentColumns } from "../columns/workstation-operating-component-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WorkstationOperatingComponentListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useWorkstationOperatingComponentList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Workstation Operating Component</h1>
        <Button onClick={() => router.push("/workstation-operating-component/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={workstationOperatingComponentColumns}
              data={data}
              onRowClick={(row) => router.push(`/workstation-operating-component/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}