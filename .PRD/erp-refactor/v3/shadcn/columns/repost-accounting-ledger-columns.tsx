"use client";

// Column definitions for Repost Accounting Ledger
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { RepostAccountingLedger } from "../types/repost-accounting-ledger.js";
import { Badge } from "@/components/ui/badge";

export const repostAccountingLedgerColumns: ColumnDef<RepostAccountingLedger>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "delete_cancelled_entries",
    header: "Delete Cancelled Ledger Entries",
    cell: ({ row }) => row.getValue("delete_cancelled_entries") ? "Yes" : "No",
  },
  {
    accessorKey: "amended_from",
    header: "Amended From",
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