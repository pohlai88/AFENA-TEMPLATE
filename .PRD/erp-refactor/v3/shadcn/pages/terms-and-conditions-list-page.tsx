"use client";

// List page for Terms and Conditions
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTermsAndConditionsList } from "../hooks/terms-and-conditions.hooks.js";
import { termsAndConditionsColumns } from "../columns/terms-and-conditions-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TermsAndConditionsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTermsAndConditionsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Terms and Conditions</h1>
        <Button onClick={() => router.push("/terms-and-conditions/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={termsAndConditionsColumns}
              data={data}
              onRowClick={(row) => router.push(`/terms-and-conditions/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}