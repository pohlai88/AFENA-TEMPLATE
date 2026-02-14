"use client";

// Column definitions for POS Payment Method
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PosPaymentMethod } from "../types/pos-payment-method.js";

export const posPaymentMethodColumns: ColumnDef<PosPaymentMethod>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "default",
    header: "Default",
    cell: ({ row }) => row.getValue("default") ? "Yes" : "No",
  },
  {
    accessorKey: "allow_in_returns",
    header: "Allow In Returns",
    cell: ({ row }) => row.getValue("allow_in_returns") ? "Yes" : "No",
  },
  {
    accessorKey: "mode_of_payment",
    header: "Mode of Payment",
  },
];