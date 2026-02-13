"use client";

// Column definitions for Stock Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { StockSettings } from "../types/stock-settings.js";

export const stockSettingsColumns: ColumnDef<StockSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_naming_by",
    header: "Item Naming By",
  },
  {
    accessorKey: "item_group",
    header: "Default Item Group",
  },
  {
    accessorKey: "stock_uom",
    header: "Default Stock UOM",
  },
];