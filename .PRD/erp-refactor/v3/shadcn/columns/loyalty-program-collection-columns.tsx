"use client";

// Column definitions for Loyalty Program Collection
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LoyaltyProgramCollection } from "../types/loyalty-program-collection.js";

export const loyaltyProgramCollectionColumns: ColumnDef<LoyaltyProgramCollection>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "tier_name",
    header: "Tier Name",
  },
  {
    accessorKey: "min_spent",
    header: "Minimum Total Spent",
    cell: ({ row }) => {
      const val = row.getValue("min_spent") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "collection_factor",
    header: "Collection Factor (=1 LP)",
    cell: ({ row }) => {
      const val = row.getValue("collection_factor") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];