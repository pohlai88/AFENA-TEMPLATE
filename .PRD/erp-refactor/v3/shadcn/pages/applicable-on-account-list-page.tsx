"use client";

// List page for Applicable On Account
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useApplicableOnAccountList } from "../hooks/applicable-on-account.hooks.js";
import { applicableOnAccountColumns } from "../columns/applicable-on-account-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ApplicableOnAccountListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useApplicableOnAccountList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Applicable On Account</h1>
        <Button onClick={() => router.push("/applicable-on-account/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={applicableOnAccountColumns}
              data={data}
              onRowClick={(row) => router.push(`/applicable-on-account/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}