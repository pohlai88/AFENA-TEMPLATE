"use client";

// Column definitions for Landed Cost Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LandedCostItem } from "../types/landed-cost-item.js";

export const landedCostItemColumns: ColumnDef<LandedCostItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "qty",
    header: "Qty",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const val = row.getValue("amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "applicable_charges",
    header: "Applicable Charges",
    cell: ({ row }) => {
      const val = row.getValue("applicable_charges") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];