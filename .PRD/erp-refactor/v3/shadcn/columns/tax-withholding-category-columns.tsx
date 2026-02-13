"use client";

// Column definitions for Tax Withholding Category
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TaxWithholdingCategory } from "../types/tax-withholding-category.js";

export const taxWithholdingCategoryColumns: ColumnDef<TaxWithholdingCategory>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "category_name",
    header: "Category Name",
  },
];