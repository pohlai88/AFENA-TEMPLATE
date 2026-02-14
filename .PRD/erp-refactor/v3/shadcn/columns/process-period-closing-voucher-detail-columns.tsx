"use client";

// Column definitions for Process Period Closing Voucher Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProcessPeriodClosingVoucherDetail } from "../types/process-period-closing-voucher-detail.js";

export const processPeriodClosingVoucherDetailColumns: ColumnDef<ProcessPeriodClosingVoucherDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "processing_date",
    header: "Processing Date",
    cell: ({ row }) => {
      const val = row.getValue("processing_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "report_type",
    header: "Report Type",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "closing_balance",
    header: "Closing Balance",
  },
];