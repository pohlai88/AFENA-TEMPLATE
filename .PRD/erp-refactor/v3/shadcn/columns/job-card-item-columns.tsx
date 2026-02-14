"use client";

// Column definitions for Job Card Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { JobCardItem } from "../types/job-card-item.js";

export const jobCardItemColumns: ColumnDef<JobCardItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "source_warehouse",
    header: "Source Warehouse",
  },
  {
    accessorKey: "required_qty",
    header: "Required Qty",
  },
];