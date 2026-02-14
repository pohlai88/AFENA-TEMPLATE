"use client";

// List page for Quotation Lost Reason
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQuotationLostReasonList } from "../hooks/quotation-lost-reason.hooks.js";
import { quotationLostReasonColumns } from "../columns/quotation-lost-reason-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuotationLostReasonListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQuotationLostReasonList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quotation Lost Reason</h1>
        <Button onClick={() => router.push("/quotation-lost-reason/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={quotationLostReasonColumns}
              data={data}
              onRowClick={(row) => router.push(`/quotation-lost-reason/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}