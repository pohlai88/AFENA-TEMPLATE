"use client";

// Column definitions for UOM Category
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { UomCategory } from "../types/uom-category.js";

export const uomCategoryColumns: ColumnDef<UomCategory>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "category_name",
    header: "Category Name",
  },
];