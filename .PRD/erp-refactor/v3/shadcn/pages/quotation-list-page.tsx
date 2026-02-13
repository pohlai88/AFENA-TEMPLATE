"use client";

// List page for Quotation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQuotationList } from "../hooks/quotation.hooks.js";
import { quotationColumns } from "../columns/quotation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuotationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQuotationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quotation</h1>
        <Button onClick={() => router.push("/quotation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={quotationColumns}
              data={data}
              onRowClick={(row) => router.push(`/quotation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}