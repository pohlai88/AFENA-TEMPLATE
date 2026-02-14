"use client";

// List page for POS Invoice Reference
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosInvoiceReferenceList } from "../hooks/pos-invoice-reference.hooks.js";
import { posInvoiceReferenceColumns } from "../columns/pos-invoice-reference-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosInvoiceReferenceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosInvoiceReferenceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Invoice Reference</h1>
        <Button onClick={() => router.push("/pos-invoice-reference/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posInvoiceReferenceColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-invoice-reference/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}