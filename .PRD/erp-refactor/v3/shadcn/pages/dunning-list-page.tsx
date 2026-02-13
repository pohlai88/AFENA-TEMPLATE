"use client";

// List page for Dunning
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useDunningList } from "../hooks/dunning.hooks.js";
import { dunningColumns } from "../columns/dunning-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DunningListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDunningList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dunning</h1>
        <Button onClick={() => router.push("/dunning/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={dunningColumns}
              data={data}
              onRowClick={(row) => router.push(`/dunning/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}