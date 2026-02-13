"use client";

// Column definitions for Bulk Transaction Log Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BulkTransactionLogDetail } from "../types/bulk-transaction-log-detail.js";

export const bulkTransactionLogDetailColumns: ColumnDef<BulkTransactionLogDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "transaction_name",
    header: "Name",
  },
  {
    accessorKey: "date",
    header: "Date ",
    cell: ({ row }) => {
      const val = row.getValue("date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "transaction_status",
    header: "Status",
  },
  {
    accessorKey: "retried",
    header: "Retried",
  },
];