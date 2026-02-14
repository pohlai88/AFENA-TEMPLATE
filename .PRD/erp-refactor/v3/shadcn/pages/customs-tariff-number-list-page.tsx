"use client";

// List page for Customs Tariff Number
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCustomsTariffNumberList } from "../hooks/customs-tariff-number.hooks.js";
import { customsTariffNumberColumns } from "../columns/customs-tariff-number-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CustomsTariffNumberListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCustomsTariffNumberList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customs Tariff Number</h1>
        <Button onClick={() => router.push("/customs-tariff-number/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={customsTariffNumberColumns}
              data={data}
              onRowClick={(row) => router.push(`/customs-tariff-number/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}