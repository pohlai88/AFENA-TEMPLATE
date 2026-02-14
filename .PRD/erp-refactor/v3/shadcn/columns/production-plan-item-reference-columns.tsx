"use client";

// Column definitions for Production Plan Item Reference
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProductionPlanItemReference } from "../types/production-plan-item-reference.js";

export const productionPlanItemReferenceColumns: ColumnDef<ProductionPlanItemReference>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_reference",
    header: "Item Reference",
  },
  {
    accessorKey: "sales_order",
    header: "Sales Order Reference",
  },
  {
    accessorKey: "sales_order_item",
    header: "Sales Order Item",
  },
  {
    accessorKey: "qty",
    header: "Qty",
  },
];