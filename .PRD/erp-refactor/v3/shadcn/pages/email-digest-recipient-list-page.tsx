"use client";

// List page for Email Digest Recipient
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useEmailDigestRecipientList } from "../hooks/email-digest-recipient.hooks.js";
import { emailDigestRecipientColumns } from "../columns/email-digest-recipient-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmailDigestRecipientListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useEmailDigestRecipientList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Email Digest Recipient</h1>
        <Button onClick={() => router.push("/email-digest-recipient/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={emailDigestRecipientColumns}
              data={data}
              onRowClick={(row) => router.push(`/email-digest-recipient/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}