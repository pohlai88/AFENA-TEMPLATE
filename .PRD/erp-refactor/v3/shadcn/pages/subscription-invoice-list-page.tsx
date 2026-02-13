"use client";

// List page for Subscription Invoice
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSubscriptionInvoiceList } from "../hooks/subscription-invoice.hooks.js";
import { subscriptionInvoiceColumns } from "../columns/subscription-invoice-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubscriptionInvoiceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSubscriptionInvoiceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subscription Invoice</h1>
        <Button onClick={() => router.push("/subscription-invoice/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={subscriptionInvoiceColumns}
              data={data}
              onRowClick={(row) => router.push(`/subscription-invoice/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}