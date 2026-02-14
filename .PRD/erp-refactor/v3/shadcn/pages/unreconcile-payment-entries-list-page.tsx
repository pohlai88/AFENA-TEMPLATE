"use client";

// List page for Unreconcile Payment Entries
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useUnreconcilePaymentEntriesList } from "../hooks/unreconcile-payment-entries.hooks.js";
import { unreconcilePaymentEntriesColumns } from "../columns/unreconcile-payment-entries-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UnreconcilePaymentEntriesListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useUnreconcilePaymentEntriesList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Unreconcile Payment Entries</h1>
        <Button onClick={() => router.push("/unreconcile-payment-entries/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={unreconcilePaymentEntriesColumns}
              data={data}
              onRowClick={(row) => router.push(`/unreconcile-payment-entries/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}