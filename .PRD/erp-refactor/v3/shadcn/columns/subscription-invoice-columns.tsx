"use client";

// Column definitions for Subscription Invoice
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubscriptionInvoice } from "../types/subscription-invoice.js";

export const subscriptionInvoiceColumns: ColumnDef<SubscriptionInvoice>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "invoice",
    header: "Invoice",
  },
];