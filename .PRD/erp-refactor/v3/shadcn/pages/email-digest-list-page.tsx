"use client";

// List page for Email Digest
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useEmailDigestList } from "../hooks/email-digest.hooks.js";
import { emailDigestColumns } from "../columns/email-digest-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmailDigestListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useEmailDigestList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Email Digest</h1>
        <Button onClick={() => router.push("/email-digest/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={emailDigestColumns}
              data={data}
              onRowClick={(row) => router.push(`/email-digest/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}