"use client";

// Column definitions for Sales Forecast Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SalesForecastItem } from "../types/sales-forecast-item.js";

export const salesForecastItemColumns: ColumnDef<SalesForecastItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "item_name",
    header: "Item Name",
  },
  {
    accessorKey: "uom",
    header: "UOM",
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
    accessorKey: "forecast_qty",
    header: "Forecast Qty",
  },
  {
    accessorKey: "adjust_qty",
    header: "Adjust Qty",
  },
  {
    accessorKey: "demand_qty",
    header: "Demand Qty",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
];