"use client";

// Column definitions for Landed Cost Taxes and Charges
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LandedCostTaxesAndCharges } from "../types/landed-cost-taxes-and-charges.js";

export const landedCostTaxesAndChargesColumns: ColumnDef<LandedCostTaxesAndCharges>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "expense_account",
    header: "Expense Account",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const val = row.getValue("amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];