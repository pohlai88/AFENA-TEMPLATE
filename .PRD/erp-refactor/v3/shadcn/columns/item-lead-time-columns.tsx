"use client";

// Column definitions for Item Lead Time
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemLeadTime } from "../types/item-lead-time.js";

export const itemLeadTimeColumns: ColumnDef<ItemLeadTime>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "capacity_per_day",
    header: "Capacity",
  },
  {
    accessorKey: "purchase_time",
    header: "Purchase Time",
  },
  {
    accessorKey: "buffer_time",
    header: "Buffer Time",
  },
];