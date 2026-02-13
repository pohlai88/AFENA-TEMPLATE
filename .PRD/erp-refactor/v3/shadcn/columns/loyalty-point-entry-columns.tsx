"use client";

// Column definitions for Loyalty Point Entry
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LoyaltyPointEntry } from "../types/loyalty-point-entry.js";

export const loyaltyPointEntryColumns: ColumnDef<LoyaltyPointEntry>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "invoice",
    header: "Invoice",
  },
  {
    accessorKey: "loyalty_points",
    header: "Loyalty Points",
  },
  {
    accessorKey: "expiry_date",
    header: "Expiry Date",
    cell: ({ row }) => {
      const val = row.getValue("expiry_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];