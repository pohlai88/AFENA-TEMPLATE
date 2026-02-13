"use client";

// Column definitions for Customer Credit Limit
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CustomerCreditLimit } from "../types/customer-credit-limit.js";

export const customerCreditLimitColumns: ColumnDef<CustomerCreditLimit>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "credit_limit",
    header: "Credit Limit",
    cell: ({ row }) => {
      const val = row.getValue("credit_limit") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "bypass_credit_limit_check",
    header: "Bypass Credit Limit Check at Sales Order",
    cell: ({ row }) => row.getValue("bypass_credit_limit_check") ? "Yes" : "No",
  },
];