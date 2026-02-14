"use client";

// List page for Common Code
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCommonCodeList } from "../hooks/common-code.hooks.js";
import { commonCodeColumns } from "../columns/common-code-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CommonCodeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCommonCodeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Common Code</h1>
        <Button onClick={() => router.push("/common-code/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={commonCodeColumns}
              data={data}
              onRowClick={(row) => router.push(`/common-code/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}