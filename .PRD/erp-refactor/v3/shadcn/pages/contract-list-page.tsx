"use client";

// List page for Contract
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useContractList } from "../hooks/contract.hooks.js";
import { contractColumns } from "../columns/contract-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ContractListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useContractList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contract</h1>
        <Button onClick={() => router.push("/contract/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={contractColumns}
              data={data}
              onRowClick={(row) => router.push(`/contract/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}