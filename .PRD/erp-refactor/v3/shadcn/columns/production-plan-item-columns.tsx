"use client";

// Column definitions for Production Plan Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProductionPlanItem } from "../types/production-plan-item.js";

export const productionPlanItemColumns: ColumnDef<ProductionPlanItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "bom_no",
    header: "BOM No",
  },
  {
    accessorKey: "planned_qty",
    header: "Planned Qty",
  },
  {
    accessorKey: "stock_uom",
    header: "UOM",
  },
  {
    accessorKey: "warehouse",
    header: "Finished Goods Warehouse",
  },
  {
    accessorKey: "planned_start_date",
    header: "Planned Start Date",
    cell: ({ row }) => {
      const val = row.getValue("planned_start_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];