"use client";

// List page for Cheque Print Template
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useChequePrintTemplateList } from "../hooks/cheque-print-template.hooks.js";
import { chequePrintTemplateColumns } from "../columns/cheque-print-template-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChequePrintTemplateListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useChequePrintTemplateList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cheque Print Template</h1>
        <Button onClick={() => router.push("/cheque-print-template/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={chequePrintTemplateColumns}
              data={data}
              onRowClick={(row) => router.push(`/cheque-print-template/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}