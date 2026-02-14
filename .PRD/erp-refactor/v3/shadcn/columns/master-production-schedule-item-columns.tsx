"use client";

// Column definitions for Master Production Schedule Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { MasterProductionScheduleItem } from "../types/master-production-schedule-item.js";

export const masterProductionScheduleItemColumns: ColumnDef<MasterProductionScheduleItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "delivery_date",
    header: "Delivery Date",
    cell: ({ row }) => {
      const val = row.getValue("delivery_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "cumulative_lead_time",
    header: "Lead Time",
  },
  {
    accessorKey: "order_release_date",
    header: "Start Date",
    cell: ({ row }) => {
      const val = row.getValue("order_release_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "planned_qty",
    header: "Planned Qty",
  },
  {
    accessorKey: "bom_no",
    header: "BOM No",
  },
];