"use client";

// Column definitions for Subcontracting Order Service Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubcontractingOrderServiceItem } from "../types/subcontracting-order-service-item.js";

export const subcontractingOrderServiceItemColumns: ColumnDef<SubcontractingOrderServiceItem>[] = [
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
    accessorKey: "qty",
    header: "Quantity",
  },
  {
    accessorKey: "rate",
    header: "Rate",
    cell: ({ row }) => {
      const val = row.getValue("rate") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const val = row.getValue("amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];