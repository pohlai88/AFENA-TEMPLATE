"use client";

// Column definitions for Item Tax Template
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemTaxTemplate } from "../types/item-tax-template.js";

export const itemTaxTemplateColumns: ColumnDef<ItemTaxTemplate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];