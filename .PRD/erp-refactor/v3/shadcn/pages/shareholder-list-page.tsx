"use client";

// List page for Shareholder
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useShareholderList } from "../hooks/shareholder.hooks.js";
import { shareholderColumns } from "../columns/shareholder-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShareholderListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useShareholderList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Shareholder</h1>
        <Button onClick={() => router.push("/shareholder/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={shareholderColumns}
              data={data}
              onRowClick={(row) => router.push(`/shareholder/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}