"use client";

// Column definitions for Payment Ledger Entry
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentLedgerEntry } from "../types/payment-ledger-entry.js";

export const paymentLedgerEntryColumns: ColumnDef<PaymentLedgerEntry>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "voucher_no",
    header: "Voucher No",
  },
  {
    accessorKey: "against_voucher_no",
    header: "Against Voucher No",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const val = row.getValue("amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "delinked",
    header: "DeLinked",
    cell: ({ row }) => row.getValue("delinked") ? "Yes" : "No",
  },
];