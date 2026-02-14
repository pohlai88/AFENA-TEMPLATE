"use client";

// Column definitions for Bank Clearance Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BankClearanceDetail } from "../types/bank-clearance-detail.js";

export const bankClearanceDetailColumns: ColumnDef<BankClearanceDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "payment_entry",
    header: "Payment Entry",
  },
  {
    accessorKey: "against_account",
    header: "Against Account",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "cheque_number",
    header: "Cheque Number",
  },
  {
    accessorKey: "cheque_date",
    header: "Cheque Date",
    cell: ({ row }) => {
      const val = row.getValue("cheque_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "clearance_date",
    header: "Clearance Date",
    cell: ({ row }) => {
      const val = row.getValue("clearance_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];