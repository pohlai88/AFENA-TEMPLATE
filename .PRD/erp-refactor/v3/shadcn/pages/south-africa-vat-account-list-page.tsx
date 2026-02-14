"use client";

// List page for South Africa VAT Account
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSouthAfricaVatAccountList } from "../hooks/south-africa-vat-account.hooks.js";
import { southAfricaVatAccountColumns } from "../columns/south-africa-vat-account-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SouthAfricaVatAccountListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSouthAfricaVatAccountList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">South Africa VAT Account</h1>
        <Button onClick={() => router.push("/south-africa-vat-account/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={southAfricaVatAccountColumns}
              data={data}
              onRowClick={(row) => router.push(`/south-africa-vat-account/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}