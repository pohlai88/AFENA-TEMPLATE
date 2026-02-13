"use client";

// Column definitions for BOM Website Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BomWebsiteItem } from "../types/bom-website-item.js";

export const bomWebsiteItemColumns: ColumnDef<BomWebsiteItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "qty",
    header: "Qty",
  },
];