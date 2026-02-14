"use client";

// Column definitions for Subcontracting Inward Order Scrap Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubcontractingInwardOrderScrapItem } from "../types/subcontracting-inward-order-scrap-item.js";

export const subcontractingInwardOrderScrapItemColumns: ColumnDef<SubcontractingInwardOrderScrapItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "fg_item_code",
    header: "Finished Good Item Code",
  },
  {
    accessorKey: "produced_qty",
    header: "Produced Qty",
  },
  {
    accessorKey: "delivered_qty",
    header: "Delivered Qty",
  },
];