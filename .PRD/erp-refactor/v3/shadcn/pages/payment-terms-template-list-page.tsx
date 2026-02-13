"use client";

// List page for Payment Terms Template
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePaymentTermsTemplateList } from "../hooks/payment-terms-template.hooks.js";
import { paymentTermsTemplateColumns } from "../columns/payment-terms-template-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentTermsTemplateListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePaymentTermsTemplateList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Terms Template</h1>
        <Button onClick={() => router.push("/payment-terms-template/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={paymentTermsTemplateColumns}
              data={data}
              onRowClick={(row) => router.push(`/payment-terms-template/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}