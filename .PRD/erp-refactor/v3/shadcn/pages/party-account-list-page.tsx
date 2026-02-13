"use client";

// List page for Party Account
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePartyAccountList } from "../hooks/party-account.hooks.js";
import { partyAccountColumns } from "../columns/party-account-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PartyAccountListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePartyAccountList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Party Account</h1>
        <Button onClick={() => router.push("/party-account/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={partyAccountColumns}
              data={data}
              onRowClick={(row) => router.push(`/party-account/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}