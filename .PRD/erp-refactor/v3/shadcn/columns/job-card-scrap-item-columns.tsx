"use client";

// Column definitions for Job Card Scrap Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { JobCardScrapItem } from "../types/job-card-scrap-item.js";

export const jobCardScrapItemColumns: ColumnDef<JobCardScrapItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Scrap Item Code",
  },
  {
    accessorKey: "item_name",
    header: "Scrap Item Name",
  },
  {
    accessorKey: "stock_qty",
    header: "Qty",
  },
];