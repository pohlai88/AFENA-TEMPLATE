"use client";

// Column definitions for Unreconcile Payment
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { UnreconcilePayment } from "../types/unreconcile-payment.js";
import { Badge } from "@/components/ui/badge";

export const unreconcilePaymentColumns: ColumnDef<UnreconcilePayment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
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