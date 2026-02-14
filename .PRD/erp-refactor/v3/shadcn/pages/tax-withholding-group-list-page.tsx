"use client";

// List page for Tax Withholding Group
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTaxWithholdingGroupList } from "../hooks/tax-withholding-group.hooks.js";
import { taxWithholdingGroupColumns } from "../columns/tax-withholding-group-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TaxWithholdingGroupListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTaxWithholdingGroupList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tax Withholding Group</h1>
        <Button onClick={() => router.push("/tax-withholding-group/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={taxWithholdingGroupColumns}
              data={data}
              onRowClick={(row) => router.push(`/tax-withholding-group/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}