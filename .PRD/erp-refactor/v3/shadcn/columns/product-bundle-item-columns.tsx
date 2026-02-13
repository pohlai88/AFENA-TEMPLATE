"use client";

// Column definitions for Product Bundle Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProductBundleItem } from "../types/product-bundle-item.js";

export const productBundleItemColumns: ColumnDef<ProductBundleItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item",
  },
  {
    accessorKey: "qty",
    header: "Qty",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },
];