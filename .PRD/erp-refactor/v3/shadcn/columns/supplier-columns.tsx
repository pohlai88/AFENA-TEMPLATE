"use client";

// Column definitions for Supplier
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Supplier } from "../types/supplier.js";

export const supplierColumns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "supplier_group",
    header: "Supplier Group",
  },
];