"use client";

// Column definitions for Tax Withholding Entry
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TaxWithholdingEntry } from "../types/tax-withholding-entry.js";

export const taxWithholdingEntryColumns: ColumnDef<TaxWithholdingEntry>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "tax_withholding_category",
    header: "Tax Withholding Category",
  },
  {
    accessorKey: "tax_withholding_group",
    header: "Tax Withholding Group",
  },
  {
    accessorKey: "taxable_amount",
    header: "Base Taxable Amount",
    cell: ({ row }) => {
      const val = row.getValue("taxable_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "tax_rate",
    header: "Tax Rate",
  },
  {
    accessorKey: "withholding_amount",
    header: "Base Tax Withheld",
    cell: ({ row }) => {
      const val = row.getValue("withholding_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "taxable_name",
    header: "Taxable Document Name",
  },
];