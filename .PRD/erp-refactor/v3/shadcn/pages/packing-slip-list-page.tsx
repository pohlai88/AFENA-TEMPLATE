"use client";

// List page for Packing Slip
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePackingSlipList } from "../hooks/packing-slip.hooks.js";
import { packingSlipColumns } from "../columns/packing-slip-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PackingSlipListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePackingSlipList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Packing Slip</h1>
        <Button onClick={() => router.push("/packing-slip/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={packingSlipColumns}
              data={data}
              onRowClick={(row) => router.push(`/packing-slip/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}