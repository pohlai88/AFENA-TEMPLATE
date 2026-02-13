"use client";

// List page for Bank
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBankList } from "../hooks/bank.hooks.js";
import { bankColumns } from "../columns/bank-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BankListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBankList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bank</h1>
        <Button onClick={() => router.push("/bank/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bankColumns}
              data={data}
              onRowClick={(row) => router.push(`/bank/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}