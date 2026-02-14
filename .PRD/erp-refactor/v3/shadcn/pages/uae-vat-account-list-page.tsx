"use client";

// List page for UAE VAT Account
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useUaeVatAccountList } from "../hooks/uae-vat-account.hooks.js";
import { uaeVatAccountColumns } from "../columns/uae-vat-account-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UaeVatAccountListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useUaeVatAccountList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">UAE VAT Account</h1>
        <Button onClick={() => router.push("/uae-vat-account/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={uaeVatAccountColumns}
              data={data}
              onRowClick={(row) => router.push(`/uae-vat-account/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}