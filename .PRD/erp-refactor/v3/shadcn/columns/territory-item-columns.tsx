"use client";

// Column definitions for Territory Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TerritoryItem } from "../types/territory-item.js";

export const territoryItemColumns: ColumnDef<TerritoryItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "territory",
    header: "Territory",
  },
];