"use client";

// Column definitions for Item Tax Template Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemTaxTemplateDetail } from "../types/item-tax-template-detail.js";

export const itemTaxTemplateDetailColumns: ColumnDef<ItemTaxTemplateDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "tax_type",
    header: "Tax",
  },
  {
    accessorKey: "tax_rate",
    header: "Tax Rate",
  },
];