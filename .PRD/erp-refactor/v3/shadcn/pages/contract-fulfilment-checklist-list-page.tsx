"use client";

// List page for Contract Fulfilment Checklist
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useContractFulfilmentChecklistList } from "../hooks/contract-fulfilment-checklist.hooks.js";
import { contractFulfilmentChecklistColumns } from "../columns/contract-fulfilment-checklist-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ContractFulfilmentChecklistListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useContractFulfilmentChecklistList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contract Fulfilment Checklist</h1>
        <Button onClick={() => router.push("/contract-fulfilment-checklist/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={contractFulfilmentChecklistColumns}
              data={data}
              onRowClick={(row) => router.push(`/contract-fulfilment-checklist/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}