"use client";

// Column definitions for Repost Payment Ledger
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { RepostPaymentLedger } from "../types/repost-payment-ledger.js";
import { Badge } from "@/components/ui/badge";

export const repostPaymentLedgerColumns: ColumnDef<RepostPaymentLedger>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
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