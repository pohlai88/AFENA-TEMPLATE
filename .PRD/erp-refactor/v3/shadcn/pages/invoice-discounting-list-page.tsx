"use client";

// List page for Invoice Discounting
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useInvoiceDiscountingList } from "../hooks/invoice-discounting.hooks.js";
import { invoiceDiscountingColumns } from "../columns/invoice-discounting-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InvoiceDiscountingListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useInvoiceDiscountingList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Invoice Discounting</h1>
        <Button onClick={() => router.push("/invoice-discounting/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={invoiceDiscountingColumns}
              data={data}
              onRowClick={(row) => router.push(`/invoice-discounting/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}