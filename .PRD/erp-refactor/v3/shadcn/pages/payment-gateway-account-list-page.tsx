"use client";

// List page for Payment Gateway Account
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePaymentGatewayAccountList } from "../hooks/payment-gateway-account.hooks.js";
import { paymentGatewayAccountColumns } from "../columns/payment-gateway-account-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentGatewayAccountListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePaymentGatewayAccountList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Gateway Account</h1>
        <Button onClick={() => router.push("/payment-gateway-account/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={paymentGatewayAccountColumns}
              data={data}
              onRowClick={(row) => router.push(`/payment-gateway-account/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}