"use client";

// List page for Opening Invoice Creation Tool
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useOpeningInvoiceCreationToolList } from "../hooks/opening-invoice-creation-tool.hooks.js";
import { openingInvoiceCreationToolColumns } from "../columns/opening-invoice-creation-tool-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OpeningInvoiceCreationToolListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useOpeningInvoiceCreationToolList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Opening Invoice Creation Tool</h1>
        <Button onClick={() => router.push("/opening-invoice-creation-tool/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={openingInvoiceCreationToolColumns}
              data={data}
              onRowClick={(row) => router.push(`/opening-invoice-creation-tool/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}