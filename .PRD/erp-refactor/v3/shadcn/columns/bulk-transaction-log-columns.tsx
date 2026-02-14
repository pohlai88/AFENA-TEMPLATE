"use client";

// Column definitions for Bulk Transaction Log
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BulkTransactionLog } from "../types/bulk-transaction-log.js";

export const bulkTransactionLogColumns: ColumnDef<BulkTransactionLog>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "log_entries",
    header: "Log Entries",
  },
];