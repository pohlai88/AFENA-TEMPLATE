"use client";

// List page for Journal Entry Template Account
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useJournalEntryTemplateAccountList } from "../hooks/journal-entry-template-account.hooks.js";
import { journalEntryTemplateAccountColumns } from "../columns/journal-entry-template-account-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JournalEntryTemplateAccountListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useJournalEntryTemplateAccountList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Journal Entry Template Account</h1>
        <Button onClick={() => router.push("/journal-entry-template-account/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={journalEntryTemplateAccountColumns}
              data={data}
              onRowClick={(row) => router.push(`/journal-entry-template-account/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}