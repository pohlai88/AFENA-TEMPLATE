"use client";

// Column definitions for Payment Order Reference
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentOrderReference } from "../types/payment-order-reference.js";

export const paymentOrderReferenceColumns: ColumnDef<PaymentOrderReference>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "reference_doctype",
    header: "Type",
  },
  {
    accessorKey: "reference_name",
    header: "Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const val = row.getValue("amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];