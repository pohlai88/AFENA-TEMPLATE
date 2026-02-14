"use client";

// Column definitions for Sales Taxes and Charges Template
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SalesTaxesAndChargesTemplate } from "../types/sales-taxes-and-charges-template.js";

export const salesTaxesAndChargesTemplateColumns: ColumnDef<SalesTaxesAndChargesTemplate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "is_default",
    header: "Default",
    cell: ({ row }) => row.getValue("is_default") ? "Yes" : "No",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];