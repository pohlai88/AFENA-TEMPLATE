"use client";

// List page for Sales Person
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSalesPersonList } from "../hooks/sales-person.hooks.js";
import { salesPersonColumns } from "../columns/sales-person-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesPersonListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSalesPersonList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Person</h1>
        <Button onClick={() => router.push("/sales-person/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={salesPersonColumns}
              data={data}
              onRowClick={(row) => router.push(`/sales-person/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}