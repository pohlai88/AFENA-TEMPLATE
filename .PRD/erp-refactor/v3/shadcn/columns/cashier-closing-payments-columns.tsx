"use client";

// Column definitions for Cashier Closing Payments
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CashierClosingPayments } from "../types/cashier-closing-payments.js";

export const cashierClosingPaymentsColumns: ColumnDef<CashierClosingPayments>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "mode_of_payment",
    header: "Mode of Payment",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];