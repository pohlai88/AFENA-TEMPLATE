"use client";

// Column definitions for Territory
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Territory } from "../types/territory.js";

export const territoryColumns: ColumnDef<Territory>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "territory_name",
    header: "Territory Name",
  },
  {
    accessorKey: "parent_territory",
    header: "Parent Territory",
  },
  {
    accessorKey: "is_group",
    header: "Is Group",
    cell: ({ row }) => row.getValue("is_group") ? "Yes" : "No",
  },
  {
    accessorKey: "territory_manager",
    header: "Territory Manager",
  },
];