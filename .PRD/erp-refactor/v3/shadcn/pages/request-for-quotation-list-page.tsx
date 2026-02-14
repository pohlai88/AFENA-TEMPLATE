"use client";

// List page for Request for Quotation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useRequestForQuotationList } from "../hooks/request-for-quotation.hooks.js";
import { requestForQuotationColumns } from "../columns/request-for-quotation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RequestForQuotationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useRequestForQuotationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Request for Quotation</h1>
        <Button onClick={() => router.push("/request-for-quotation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={requestForQuotationColumns}
              data={data}
              onRowClick={(row) => router.push(`/request-for-quotation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}