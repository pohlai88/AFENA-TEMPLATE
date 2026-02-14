"use client";

// List page for Price List Country
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePriceListCountryList } from "../hooks/price-list-country.hooks.js";
import { priceListCountryColumns } from "../columns/price-list-country-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PriceListCountryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePriceListCountryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Price List Country</h1>
        <Button onClick={() => router.push("/price-list-country/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={priceListCountryColumns}
              data={data}
              onRowClick={(row) => router.push(`/price-list-country/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}