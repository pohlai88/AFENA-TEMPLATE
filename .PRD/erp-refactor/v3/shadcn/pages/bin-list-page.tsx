"use client";

// List page for Bin
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBinList } from "../hooks/bin.hooks.js";
import { binColumns } from "../columns/bin-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BinListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBinList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bin</h1>
        <Button onClick={() => router.push("/bin/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={binColumns}
              data={data}
              onRowClick={(row) => router.push(`/bin/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}