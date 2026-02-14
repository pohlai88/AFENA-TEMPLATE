"use client";

// List page for Loyalty Point Entry Redemption
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLoyaltyPointEntryRedemptionList } from "../hooks/loyalty-point-entry-redemption.hooks.js";
import { loyaltyPointEntryRedemptionColumns } from "../columns/loyalty-point-entry-redemption-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoyaltyPointEntryRedemptionListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLoyaltyPointEntryRedemptionList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Loyalty Point Entry Redemption</h1>
        <Button onClick={() => router.push("/loyalty-point-entry-redemption/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={loyaltyPointEntryRedemptionColumns}
              data={data}
              onRowClick={(row) => router.push(`/loyalty-point-entry-redemption/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}