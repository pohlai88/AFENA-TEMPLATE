"use client";

// Column definitions for Journal Entry
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { JournalEntry } from "../types/journal-entry.js";
import { Badge } from "@/components/ui/badge";

export const journalEntryColumns: ColumnDef<JournalEntry>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "cheque_no",
    header: "Reference Number",
  },
  {
    accessorKey: "total_debit",
    header: "Total Debit",
    cell: ({ row }) => {
      const val = row.getValue("total_debit") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    id: "docstatus",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original as any).docstatus;
      return (
        <Badge variant={status === 1 ? "default" : "secondary"}>
          {status === 0 ? "Draft" : status === 1 ? "Submitted" : "Cancelled"}
        </Badge>
      );
    },
  },
];