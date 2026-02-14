"use client";

// List page for Incoterm
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useIncotermList } from "../hooks/incoterm.hooks.js";
import { incotermColumns } from "../columns/incoterm-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function IncotermListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useIncotermList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Incoterm</h1>
        <Button onClick={() => router.push("/incoterm/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={incotermColumns}
              data={data}
              onRowClick={(row) => router.push(`/incoterm/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}