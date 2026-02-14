"use client";

// Column definitions for Website Item Group
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { WebsiteItemGroup } from "../types/website-item-group.js";

export const websiteItemGroupColumns: ColumnDef<WebsiteItemGroup>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_group",
    header: "Item Group",
  },
];