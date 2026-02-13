"use client";

// Column definitions for POS Item Group
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PosItemGroup } from "../types/pos-item-group.js";

export const posItemGroupColumns: ColumnDef<PosItemGroup>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_group",
    header: "Item Group",
  },
];