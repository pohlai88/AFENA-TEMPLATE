"use client";

// List page for Tax Withholding Account
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTaxWithholdingAccountList } from "../hooks/tax-withholding-account.hooks.js";
import { taxWithholdingAccountColumns } from "../columns/tax-withholding-account-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TaxWithholdingAccountListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTaxWithholdingAccountList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tax Withholding Account</h1>
        <Button onClick={() => router.push("/tax-withholding-account/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={taxWithholdingAccountColumns}
              data={data}
              onRowClick={(row) => router.push(`/tax-withholding-account/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}