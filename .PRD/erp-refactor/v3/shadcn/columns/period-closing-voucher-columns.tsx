"use client";

// Column definitions for Period Closing Voucher
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PeriodClosingVoucher } from "../types/period-closing-voucher.js";
import { Badge } from "@/components/ui/badge";

export const periodClosingVoucherColumns: ColumnDef<PeriodClosingVoucher>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "fiscal_year",
    header: "Fiscal Year",
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