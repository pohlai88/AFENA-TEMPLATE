"use client";

// Column definitions for Production Plan Sales Order
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProductionPlanSalesOrder } from "../types/production-plan-sales-order.js";

export const productionPlanSalesOrderColumns: ColumnDef<ProductionPlanSalesOrder>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "sales_order",
    header: "Sales Order",
  },
  {
    accessorKey: "sales_order_date",
    header: "Sales Order Date",
    cell: ({ row }) => {
      const val = row.getValue("sales_order_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "grand_total",
    header: "Grand Total",
    cell: ({ row }) => {
      const val = row.getValue("grand_total") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];