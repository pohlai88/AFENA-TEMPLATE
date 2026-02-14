"use client";

// List page for Loyalty Point Entry
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLoyaltyPointEntryList } from "../hooks/loyalty-point-entry.hooks.js";
import { loyaltyPointEntryColumns } from "../columns/loyalty-point-entry-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoyaltyPointEntryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLoyaltyPointEntryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Loyalty Point Entry</h1>
        <Button onClick={() => router.push("/loyalty-point-entry/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={loyaltyPointEntryColumns}
              data={data}
              onRowClick={(row) => router.push(`/loyalty-point-entry/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}