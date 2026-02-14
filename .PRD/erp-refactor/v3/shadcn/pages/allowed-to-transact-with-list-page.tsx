"use client";

// List page for Allowed To Transact With
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAllowedToTransactWithList } from "../hooks/allowed-to-transact-with.hooks.js";
import { allowedToTransactWithColumns } from "../columns/allowed-to-transact-with-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AllowedToTransactWithListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAllowedToTransactWithList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Allowed To Transact With</h1>
        <Button onClick={() => router.push("/allowed-to-transact-with/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={allowedToTransactWithColumns}
              data={data}
              onRowClick={(row) => router.push(`/allowed-to-transact-with/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}