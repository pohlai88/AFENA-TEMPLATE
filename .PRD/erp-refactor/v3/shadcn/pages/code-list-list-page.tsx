"use client";

// List page for Code List
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCodeListList } from "../hooks/code-list.hooks.js";
import { codeListColumns } from "../columns/code-list-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CodeListListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCodeListList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Code List</h1>
        <Button onClick={() => router.push("/code-list/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={codeListColumns}
              data={data}
              onRowClick={(row) => router.push(`/code-list/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}