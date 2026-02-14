"use client";

// List page for Supplier Quotation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupplierQuotationList } from "../hooks/supplier-quotation.hooks.js";
import { supplierQuotationColumns } from "../columns/supplier-quotation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupplierQuotationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupplierQuotationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Quotation</h1>
        <Button onClick={() => router.push("/supplier-quotation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supplierQuotationColumns}
              data={data}
              onRowClick={(row) => router.push(`/supplier-quotation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}