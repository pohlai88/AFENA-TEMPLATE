"use client";

// List page for Workstation Operating Component Account
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useWorkstationOperatingComponentAccountList } from "../hooks/workstation-operating-component-account.hooks.js";
import { workstationOperatingComponentAccountColumns } from "../columns/workstation-operating-component-account-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WorkstationOperatingComponentAccountListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useWorkstationOperatingComponentAccountList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Workstation Operating Component Account</h1>
        <Button onClick={() => router.push("/workstation-operating-component-account/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={workstationOperatingComponentAccountColumns}
              data={data}
              onRowClick={(row) => router.push(`/workstation-operating-component-account/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}