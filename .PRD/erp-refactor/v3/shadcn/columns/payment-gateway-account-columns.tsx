"use client";

// Column definitions for Payment Gateway Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentGatewayAccount } from "../types/payment-gateway-account.js";

export const paymentGatewayAccountColumns: ColumnDef<PaymentGatewayAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "payment_gateway",
    header: "Payment Gateway",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "payment_account",
    header: "Payment Account",
  },
];