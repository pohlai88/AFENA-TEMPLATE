"use client";

// Column definitions for Bank Reconciliation Tool
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BankReconciliationTool } from "../types/bank-reconciliation-tool.js";

export const bankReconciliationToolColumns: ColumnDef<BankReconciliationTool>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "bank_account",
    header: "Bank Account",
  },
  {
    accessorKey: "bank_statement_from_date",
    header: "From Date",
    cell: ({ row }) => {
      const val = row.getValue("bank_statement_from_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "bank_statement_to_date",
    header: "To Date",
    cell: ({ row }) => {
      const val = row.getValue("bank_statement_to_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "from_reference_date",
    header: "From Reference Date",
    cell: ({ row }) => {
      const val = row.getValue("from_reference_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];