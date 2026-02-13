"use client";

// Column definitions for Production Plan Sub Assembly Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProductionPlanSubAssemblyItem } from "../types/production-plan-sub-assembly-item.js";

export const productionPlanSubAssemblyItemColumns: ColumnDef<ProductionPlanSubAssemblyItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "production_item",
    header: "Sub Assembly Item Code",
  },
  {
    accessorKey: "bom_no",
    header: "BOM No",
  },
  {
    accessorKey: "type_of_manufacturing",
    header: "Manufacturing Type",
  },
  {
    accessorKey: "required_qty",
    header: "Required Qty",
  },
  {
    accessorKey: "projected_qty",
    header: "Projected Qty",
  },
  {
    accessorKey: "qty",
    header: "Qty to Order",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
];