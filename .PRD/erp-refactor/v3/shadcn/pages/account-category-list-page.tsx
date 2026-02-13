"use client";

// List page for Account Category
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAccountCategoryList } from "../hooks/account-category.hooks.js";
import { accountCategoryColumns } from "../columns/account-category-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountCategoryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAccountCategoryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Account Category</h1>
        <Button onClick={() => router.push("/account-category/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={accountCategoryColumns}
              data={data}
              onRowClick={(row) => router.push(`/account-category/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}