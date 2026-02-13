"use client";

// Column definitions for Repost Item Valuation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { RepostItemValuation } from "../types/repost-item-valuation.js";
import { Badge } from "@/components/ui/badge";

export const repostItemValuationColumns: ColumnDef<RepostItemValuation>[] = [
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
  {
    accessorKey: "status",
    header: "Status",
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