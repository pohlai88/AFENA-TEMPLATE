"use client";

// List page for Finance Book
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useFinanceBookList } from "../hooks/finance-book.hooks.js";
import { financeBookColumns } from "../columns/finance-book-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FinanceBookListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useFinanceBookList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Finance Book</h1>
        <Button onClick={() => router.push("/finance-book/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={financeBookColumns}
              data={data}
              onRowClick={(row) => router.push(`/finance-book/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}