"use client";

// Column definitions for Repost Accounting Ledger Items
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { RepostAccountingLedgerItems } from "../types/repost-accounting-ledger-items.js";

export const repostAccountingLedgerItemsColumns: ColumnDef<RepostAccountingLedgerItems>[] = [
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