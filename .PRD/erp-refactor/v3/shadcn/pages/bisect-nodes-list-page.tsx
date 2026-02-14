"use client";

// List page for Bisect Nodes
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBisectNodesList } from "../hooks/bisect-nodes.hooks.js";
import { bisectNodesColumns } from "../columns/bisect-nodes-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BisectNodesListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBisectNodesList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bisect Nodes</h1>
        <Button onClick={() => router.push("/bisect-nodes/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bisectNodesColumns}
              data={data}
              onRowClick={(row) => router.push(`/bisect-nodes/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}