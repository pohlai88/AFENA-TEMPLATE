"use client";

// Column definitions for Advance Taxes and Charges
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AdvanceTaxesAndCharges } from "../types/advance-taxes-and-charges.js";

export const advanceTaxesAndChargesColumns: ColumnDef<AdvanceTaxesAndCharges>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "charge_type",
    header: "Type",
  },
  {
    accessorKey: "account_head",
    header: "Account Head",
  },
  {
    accessorKey: "rate",
    header: "Tax Rate",
  },
  {
    accessorKey: "net_amount",
    header: "Net Amount",
    cell: ({ row }) => {
      const val = row.getValue("net_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "tax_amount",
    header: "Amount",
    cell: ({ row }) => {
      const val = row.getValue("tax_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const val = row.getValue("total") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];