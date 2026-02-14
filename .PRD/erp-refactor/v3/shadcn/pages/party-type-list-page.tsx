"use client";

// List page for Party Type
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePartyTypeList } from "../hooks/party-type.hooks.js";
import { partyTypeColumns } from "../columns/party-type-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PartyTypeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePartyTypeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Party Type</h1>
        <Button onClick={() => router.push("/party-type/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={partyTypeColumns}
              data={data}
              onRowClick={(row) => router.push(`/party-type/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}