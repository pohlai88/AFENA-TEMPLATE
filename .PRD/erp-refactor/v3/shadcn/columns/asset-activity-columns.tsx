"use client";

// Column definitions for Asset Activity
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetActivity } from "../types/asset-activity.js";

export const assetActivityColumns: ColumnDef<AssetActivity>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "asset",
    header: "Asset",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
];