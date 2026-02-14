"use client";

// Column definitions for Purchase Taxes and Charges Template
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PurchaseTaxesAndChargesTemplate } from "../types/purchase-taxes-and-charges-template.js";

export const purchaseTaxesAndChargesTemplateColumns: ColumnDef<PurchaseTaxesAndChargesTemplate>[] = [
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
    accessorKey: "disabled",
    header: "Disabled",
    cell: ({ row }) => row.getValue("disabled") ? "Yes" : "No",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];