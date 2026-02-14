"use client";

// List page for Contract Template
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useContractTemplateList } from "../hooks/contract-template.hooks.js";
import { contractTemplateColumns } from "../columns/contract-template-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ContractTemplateListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useContractTemplateList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contract Template</h1>
        <Button onClick={() => router.push("/contract-template/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={contractTemplateColumns}
              data={data}
              onRowClick={(row) => router.push(`/contract-template/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}