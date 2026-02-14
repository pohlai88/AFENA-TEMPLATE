"use client";

// List page for Party Specific Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePartySpecificItemList } from "../hooks/party-specific-item.hooks.js";
import { partySpecificItemColumns } from "../columns/party-specific-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PartySpecificItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePartySpecificItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Party Specific Item</h1>
        <Button onClick={() => router.push("/party-specific-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={partySpecificItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/party-specific-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}