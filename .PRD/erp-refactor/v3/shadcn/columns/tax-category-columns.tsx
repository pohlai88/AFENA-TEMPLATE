"use client";

// Column definitions for Tax Category
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TaxCategory } from "../types/tax-category.js";

export const taxCategoryColumns: ColumnDef<TaxCategory>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
];