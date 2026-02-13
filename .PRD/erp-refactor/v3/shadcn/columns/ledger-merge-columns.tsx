"use client";

// Column definitions for Ledger Merge
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LedgerMerge } from "../types/ledger-merge.js";

export const ledgerMergeColumns: ColumnDef<LedgerMerge>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];