"use client";

// List page for Purchase Taxes and Charges Template
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePurchaseTaxesAndChargesTemplateList } from "../hooks/purchase-taxes-and-charges-template.hooks.js";
import { purchaseTaxesAndChargesTemplateColumns } from "../columns/purchase-taxes-and-charges-template-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PurchaseTaxesAndChargesTemplateListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePurchaseTaxesAndChargesTemplateList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Purchase Taxes and Charges Template</h1>
        <Button onClick={() => router.push("/purchase-taxes-and-charges-template/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={purchaseTaxesAndChargesTemplateColumns}
              data={data}
              onRowClick={(row) => router.push(`/purchase-taxes-and-charges-template/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}