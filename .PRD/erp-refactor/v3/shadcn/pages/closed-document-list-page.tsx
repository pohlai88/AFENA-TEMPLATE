"use client";

// List page for Closed Document
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useClosedDocumentList } from "../hooks/closed-document.hooks.js";
import { closedDocumentColumns } from "../columns/closed-document-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ClosedDocumentListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useClosedDocumentList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Closed Document</h1>
        <Button onClick={() => router.push("/closed-document/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={closedDocumentColumns}
              data={data}
              onRowClick={(row) => router.push(`/closed-document/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}