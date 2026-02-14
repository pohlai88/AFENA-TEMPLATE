"use client";

// Column definitions for Target Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TargetDetail } from "../types/target-detail.js";

export const targetDetailColumns: ColumnDef<TargetDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_group",
    header: "Item Group",
  },
  {
    accessorKey: "fiscal_year",
    header: "Fiscal Year",
  },
  {
    accessorKey: "target_qty",
    header: "Target Qty",
  },
  {
    accessorKey: "target_amount",
    header: "Target  Amount",
  },
  {
    accessorKey: "distribution_id",
    header: "Target Distribution",
  },
];