"use client";

// List page for Party Link
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePartyLinkList } from "../hooks/party-link.hooks.js";
import { partyLinkColumns } from "../columns/party-link-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PartyLinkListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePartyLinkList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Party Link</h1>
        <Button onClick={() => router.push("/party-link/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={partyLinkColumns}
              data={data}
              onRowClick={(row) => router.push(`/party-link/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}