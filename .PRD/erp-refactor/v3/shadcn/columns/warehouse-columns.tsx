"use client";

// Column definitions for Warehouse
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Warehouse } from "../types/warehouse.js";

export const warehouseColumns: ColumnDef<Warehouse>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "is_group",
    header: "Is Group Warehouse",
    cell: ({ row }) => row.getValue("is_group") ? "Yes" : "No",
  },
];