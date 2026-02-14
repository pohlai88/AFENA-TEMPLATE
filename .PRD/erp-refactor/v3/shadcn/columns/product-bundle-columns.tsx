"use client";

// Column definitions for Product Bundle
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProductBundle } from "../types/product-bundle.js";

export const productBundleColumns: ColumnDef<ProductBundle>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "new_item_code",
    header: "Parent Item",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];