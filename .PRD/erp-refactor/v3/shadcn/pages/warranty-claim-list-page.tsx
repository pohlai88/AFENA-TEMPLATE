"use client";

// List page for Warranty Claim
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useWarrantyClaimList } from "../hooks/warranty-claim.hooks.js";
import { warrantyClaimColumns } from "../columns/warranty-claim-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WarrantyClaimListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useWarrantyClaimList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Warranty Claim</h1>
        <Button onClick={() => router.push("/warranty-claim/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={warrantyClaimColumns}
              data={data}
              onRowClick={(row) => router.push(`/warranty-claim/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}