"use client";

// Column definitions for Delivery Schedule Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { DeliveryScheduleItem } from "../types/delivery-schedule-item.js";

export const deliveryScheduleItemColumns: ColumnDef<DeliveryScheduleItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
    accessorKey: "qty",
    header: "Qty",
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },
];