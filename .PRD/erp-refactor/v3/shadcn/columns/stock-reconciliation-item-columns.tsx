"use client";

// Column definitions for Stock Reconciliation Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { StockReconciliationItem } from "../types/stock-reconciliation-item.js";

export const stockReconciliationItemColumns: ColumnDef<StockReconciliationItem>[] = [
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
    header: "Warehouse",
  },
  {
    accessorKey: "qty",
    header: "Quantity",
  },
  {
    accessorKey: "stock_uom",
    header: "Stock UOM",
  },
  {
    accessorKey: "valuation_rate",
    header: "Valuation Rate",
    cell: ({ row }) => {
      const val = row.getValue("valuation_rate") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];