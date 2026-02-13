"use client";

// Column definitions for Ledger Health
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LedgerHealth } from "../types/ledger-health.js";

export const ledgerHealthColumns: ColumnDef<LedgerHealth>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "voucher_type",
    header: "Voucher Type",
  },
  {
    accessorKey: "voucher_no",
    header: "Voucher No",
  },
  {
    accessorKey: "checked_on",
    header: "Checked On",
    cell: ({ row }) => {
      const val = row.getValue("checked_on") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "debit_credit_mismatch",
    header: "Debit-Credit mismatch",
    cell: ({ row }) => row.getValue("debit_credit_mismatch") ? "Yes" : "No",
  },
  {
    accessorKey: "general_and_payment_ledger_mismatch",
    header: "General and Payment Ledger mismatch",
    cell: ({ row }) => row.getValue("general_and_payment_ledger_mismatch") ? "Yes" : "No",
  },
];