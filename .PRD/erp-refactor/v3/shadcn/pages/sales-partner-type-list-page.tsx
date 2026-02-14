"use client";

// List page for Sales Partner Type
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSalesPartnerTypeList } from "../hooks/sales-partner-type.hooks.js";
import { salesPartnerTypeColumns } from "../columns/sales-partner-type-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesPartnerTypeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSalesPartnerTypeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Partner Type</h1>
        <Button onClick={() => router.push("/sales-partner-type/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={salesPartnerTypeColumns}
              data={data}
              onRowClick={(row) => router.push(`/sales-partner-type/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}