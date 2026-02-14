"use client";

// List page for Cashier Closing
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCashierClosingList } from "../hooks/cashier-closing.hooks.js";
import { cashierClosingColumns } from "../columns/cashier-closing-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CashierClosingListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCashierClosingList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cashier Closing</h1>
        <Button onClick={() => router.push("/cashier-closing/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={cashierClosingColumns}
              data={data}
              onRowClick={(row) => router.push(`/cashier-closing/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}