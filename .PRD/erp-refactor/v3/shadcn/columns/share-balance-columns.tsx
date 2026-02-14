"use client";

// Column definitions for Share Balance
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ShareBalance } from "../types/share-balance.js";

export const shareBalanceColumns: ColumnDef<ShareBalance>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "share_type",
    header: "Share Type",
  },
  {
    accessorKey: "rate",
    header: "Rate",
    cell: ({ row }) => {
      const val = row.getValue("rate") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "no_of_shares",
    header: "No of Shares",
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