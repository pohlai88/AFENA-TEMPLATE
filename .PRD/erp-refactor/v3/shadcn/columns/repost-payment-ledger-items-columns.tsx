"use client";

// Column definitions for Repost Payment Ledger Items
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { RepostPaymentLedgerItems } from "../types/repost-payment-ledger-items.js";

export const repostPaymentLedgerItemsColumns: ColumnDef<RepostPaymentLedgerItems>[] = [
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
];