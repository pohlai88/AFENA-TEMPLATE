"use client";

// List page for Subcontracting Receipt
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSubcontractingReceiptList } from "../hooks/subcontracting-receipt.hooks.js";
import { subcontractingReceiptColumns } from "../columns/subcontracting-receipt-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubcontractingReceiptListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSubcontractingReceiptList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subcontracting Receipt</h1>
        <Button onClick={() => router.push("/subcontracting-receipt/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={subcontractingReceiptColumns}
              data={data}
              onRowClick={(row) => router.push(`/subcontracting-receipt/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}