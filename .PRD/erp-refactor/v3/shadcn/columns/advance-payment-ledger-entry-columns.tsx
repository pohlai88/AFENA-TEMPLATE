"use client";

// Column definitions for Advance Payment Ledger Entry
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AdvancePaymentLedgerEntry } from "../types/advance-payment-ledger-entry.js";

export const advancePaymentLedgerEntryColumns: ColumnDef<AdvancePaymentLedgerEntry>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
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
    accessorKey: "against_voucher_type",
    header: "Against Voucher Type",
  },
  {
    accessorKey: "against_voucher_no",
    header: "Against Voucher No",
  },
];