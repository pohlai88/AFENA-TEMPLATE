"use client";

// Column definitions for Supplier Group
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupplierGroup } from "../types/supplier-group.js";

export const supplierGroupColumns: ColumnDef<SupplierGroup>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "parent_supplier_group",
    header: "Parent Supplier Group",
  },
  {
    accessorKey: "is_group",
    header: "Is Group",
    cell: ({ row }) => row.getValue("is_group") ? "Yes" : "No",
  },
];