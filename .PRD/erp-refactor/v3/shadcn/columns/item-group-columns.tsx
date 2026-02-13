"use client";

// Column definitions for Item Group
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemGroup } from "../types/item-group.js";

export const itemGroupColumns: ColumnDef<ItemGroup>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_group_name",
    header: "Item Group Name",
  },
  {
    accessorKey: "parent_item_group",
    header: "Parent Item Group",
  },
  {
    accessorKey: "is_group",
    header: "Is Group",
    cell: ({ row }) => row.getValue("is_group") ? "Yes" : "No",
  },
];