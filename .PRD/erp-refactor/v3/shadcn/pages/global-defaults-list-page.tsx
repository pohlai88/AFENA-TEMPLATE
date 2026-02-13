"use client";

// List page for Global Defaults
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useGlobalDefaultsList } from "../hooks/global-defaults.hooks.js";
import { globalDefaultsColumns } from "../columns/global-defaults-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GlobalDefaultsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useGlobalDefaultsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Global Defaults</h1>
        <Button onClick={() => router.push("/global-defaults/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={globalDefaultsColumns}
              data={data}
              onRowClick={(row) => router.push(`/global-defaults/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}