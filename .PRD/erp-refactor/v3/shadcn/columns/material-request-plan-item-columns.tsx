"use client";

// Column definitions for Material Request Plan Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { MaterialRequestPlanItem } from "../types/material-request-plan-item.js";

export const materialRequestPlanItemColumns: ColumnDef<MaterialRequestPlanItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "warehouse",
    header: "For Warehouse",
  },
  {
    accessorKey: "material_request_type",
    header: "Type",
  },
  {
    accessorKey: "required_bom_qty",
    header: "Reqd Qty (BOM)",
  },
  {
    accessorKey: "projected_qty",
    header: "Projected Qty",
  },
  {
    accessorKey: "quantity",
    header: "Required Qty",
  },
  {
    accessorKey: "schedule_date",
    header: "Required By",
    cell: ({ row }) => {
      const val = row.getValue("schedule_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "min_order_qty",
    header: "Minimum Order Quantity",
  },
];