"use client";

// Column definitions for Bank Transaction
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BankTransaction } from "../types/bank-transaction.js";
import { Badge } from "@/components/ui/badge";

export const bankTransactionColumns: ColumnDef<BankTransaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "deposit",
    header: "Deposit",
    cell: ({ row }) => {
      const val = row.getValue("deposit") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "withdrawal",
    header: "Withdrawal",
    cell: ({ row }) => {
      const val = row.getValue("withdrawal") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "description",
    header: "Description",
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