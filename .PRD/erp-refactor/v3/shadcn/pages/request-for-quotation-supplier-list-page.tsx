"use client";

// List page for Request for Quotation Supplier
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useRequestForQuotationSupplierList } from "../hooks/request-for-quotation-supplier.hooks.js";
import { requestForQuotationSupplierColumns } from "../columns/request-for-quotation-supplier-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RequestForQuotationSupplierListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useRequestForQuotationSupplierList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Request for Quotation Supplier</h1>
        <Button onClick={() => router.push("/request-for-quotation-supplier/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={requestForQuotationSupplierColumns}
              data={data}
              onRowClick={(row) => router.push(`/request-for-quotation-supplier/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}